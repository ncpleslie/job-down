package services

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"log"
	"net/http"
	"strings"

	"github.com/gen2brain/go-fitz"

	"github.com/ncpleslie/job-down/internal/db"
	"github.com/ncpleslie/job-down/internal/models/entities"
	requests "github.com/ncpleslie/job-down/internal/models/requests"
	"github.com/ncpleslie/job-down/internal/models/responses"
	store "github.com/ncpleslie/job-down/internal/storage"
)

type JobService struct {
	Storage *store.Storage
	DB      *db.DB
	Log     *log.Logger
}

func NewJobService(storage *store.Storage, db *db.DB, log *log.Logger) *JobService {
	return &JobService{
		Storage: storage,
		DB:      db,
		Log:     log,
	}
}

func (s *JobService) GetJob(ctx context.Context, userId string, jobId string) (responses.Job, error) {
	job, err := s.DB.GetJob(ctx, userId, jobId)
	if err != nil {
		return responses.Job{}, err
	}

	jobResponse := job.ToResponse()
	if job.ImageFilename == "" {
		return jobResponse, nil
	}

	jobResponse.ImageUrl, err = s.Storage.GetDownloadURL(ctx, job.ImageFilename)
	if err != nil {
		return responses.Job{}, err
	}

	return jobResponse, nil
}

func (s *JobService) GetJobs(ctx context.Context, userId string) ([]responses.Job, error) {
	jobs, err := s.DB.GetJobs(ctx, userId)
	if err != nil {
		return nil, err
	}

	// Convert job entities to job responses
	var jobResponses []responses.Job
	for _, job := range jobs {
		jobR := job.ToResponse()
		jobR.ImageUrl, err = s.Storage.GetDownloadURL(ctx, job.ImageFilename)
		if err != nil {
			return nil, err
		}
		jobResponses = append(jobResponses, job.ToResponse())
	}

	return jobResponses, nil
}

func (s *JobService) CreateNewJob(ctx context.Context, userId string, job requests.Job) (<-chan responses.Job, <-chan error) {
	jobChan := make(chan responses.Job)
	errChan := make(chan error, 1)

	go func() {
		defer close(jobChan)
		defer close(errChan)

		statuses := make([]entities.Status, 0)
		status := entities.NewStatusEntity(job.Status)
		statuses = append(statuses, status)

		jobEntity, err := s.DB.AddJob(ctx, userId, entities.NewJobEntity(job, statuses))
		if err != nil {
			errChan <- err
			return
		}

		jobChan <- jobEntity.ToResponse()

		if job.Image == "" {
			return
		}

		splitStr := strings.Split(job.Image, ",")
		b, err := base64.StdEncoding.DecodeString(splitStr[1])
		if err != nil {
			log.Println("Error decoding base64 image: ", err)
			errChan <- err
			return
		}
		// Files can be uploaded in multiple formats.
		// This includes PDFs that can't be displayed in the frontend.
		// To handle this, we convert the PDF (and all its pages) to a PNG image.
		mimeType := http.DetectContentType(b)
		if mimeType == "application/pdf" {
			b, err = pdfBytesToPngBytes(b)
			if err != nil {
				log.Println("Error converting PDF to PNG: ", err)
				errChan <- err
				return
			}
			mimeType = "image/png"
		}

		extension := strings.Split(mimeType, "/")[1]
		filename := fmt.Sprintf("%s/%s.%s", userId, jobEntity.Id, extension)
		downloadUrl, err := s.Storage.UploadFile(ctx, filename, b)
		if err != nil {
			log.Println("Error uploading image: ", err)

			errChan <- err
			return
		}

		jobEntity.ImageFilename = filename
		updatedJobEntity, err := s.DB.UpdateJob(ctx, userId, jobEntity.Id, jobEntity)
		if err != nil {
			log.Println("Error updating job with image filename: ", err)
			errChan <- err
			return
		}

		jobResponse := updatedJobEntity.ToResponse()
		jobResponse.ImageUrl = downloadUrl

		jobChan <- jobResponse
	}()

	return jobChan, errChan
}

func (s *JobService) UpdateJob(ctx context.Context, userId string, jobId string, job requests.Job) (responses.Job, error) {
	jobEntity, err := s.DB.GetJob(ctx, userId, jobId)
	if err != nil {
		return responses.Job{}, err
	}

	// Don't allow the same status to be added multiple times in a row.
	mostRecentStatus := jobEntity.Statuses[0]
	for _, status := range jobEntity.Statuses {
		if status.CreatedAt.After(mostRecentStatus.CreatedAt) {
			mostRecentStatus = status
		}
	}

	statuses := make([]entities.Status, 0)
	statuses = append(statuses, jobEntity.Statuses...)
	if mostRecentStatus.Status != job.Status {
		statuses = append(statuses, entities.NewStatusEntity(job.Status))
	}

	jobEntity.Position = job.Position
	jobEntity.Company = job.Company
	jobEntity.Url = job.Url
	jobEntity.Statuses = statuses
	jobEntity.Notes = job.Notes

	updatedJobEntity, err := s.DB.UpdateJob(ctx, userId, jobId, jobEntity)
	if err != nil {
		return responses.Job{}, err
	}

	jobResponse := updatedJobEntity.ToResponse()
	jobResponse.ImageUrl, err = s.Storage.GetDownloadURL(ctx, updatedJobEntity.ImageFilename)
	if err != nil {
		return responses.Job{}, err
	}

	return jobResponse, nil
}

func (s *JobService) DeleteJob(ctx context.Context, userId string, jobId string) error {
	jobEntity, err := s.DB.GetJob(ctx, userId, jobId)
	if err != nil {
		return err
	}

	err = s.Storage.DeleteFile(ctx, jobEntity.ImageFilename)
	if err != nil {
		// Just log the error for now so we can still delete the job
		// TODO: Add to jobs that failed a queue to retry later
		log.Println("Error deleting image: ", err)
	}

	return s.DB.DeleteJob(ctx, userId, jobId)
}

// GetStats returns the stats for a user.
// The stats include the total number of jobs, the number of jobs in each status, and the number of jobs in each status historically.
func (s *JobService) GetStats(ctx context.Context, userId string) (responses.Stats, error) {
	jobs, err := s.DB.GetJobs(ctx, userId)
	if err != nil {
		return responses.Stats{}, err
	}

	stats := responses.Stats{}
	stats.Current = &responses.Stat{}
	stats.Historical = &responses.Stat{}
	for _, job := range jobs {
		mostRecentStatus := job.Statuses[0]
		for _, status := range job.Statuses {
			if status.CreatedAt.After(mostRecentStatus.CreatedAt) {
				mostRecentStatus = status
			}
		}

		incrementStatsField(stats.Current, mostRecentStatus.Status)

		for _, status := range job.Statuses {
			incrementStatsField(stats.Historical, status.Status)
		}
	}

	stats.Total = len(jobs)
	return stats, nil
}

// Increments the appropriate field in the stats struct based on the status.
// Returns the updated stats struct.
func incrementStatsField(stats *responses.Stat, status string) {
	switch status {
	case "applied":
		stats.Applied++
	case "phone_screen":
	case "coding_challenge":
	case "first_interview":
	case "second_interview":
	case "final_interview":
		stats.Interview++
	case "offer":
		stats.Offer++
	case "rejected":
		stats.Rejected++
	case "accepted":
		stats.Accepted++
	case "withdrawn":
		stats.Withdrawn++
	default:
		stats.Other++
	}
}

// Converts a PDF byte slice to a PNG byte slice.
// Returns the bytes of the new PNG image.
func pdfBytesToPngBytes(pdf []byte) ([]byte, error) {
	doc, err := fitz.NewFromMemory(pdf)
	if err != nil {
		return nil, err
	}

	images := make([]image.Image, 0)
	for page := range doc.NumPage() {
		img, err := doc.Image(page)
		if err != nil {
			return nil, err
		}
		images = append(images, img)
	}

	if len(images) == 0 {
		return nil, fmt.Errorf("no images found in PDF")
	}

	if len(images) > 1 {
		return combineImagesVertically(images)
	}

	buf := new(bytes.Buffer)
	err = png.Encode(buf, images[0])
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// Combines multiple images into a single image vertically.
// Returns the bytes of the new image.
func combineImagesVertically(images []image.Image) ([]byte, error) {
	// Calculate total height of new image
	totalHeight := 0
	maxWidth := 0
	for _, img := range images {
		if img.Bounds().Dx() > maxWidth {
			maxWidth = img.Bounds().Dx()
		}
		totalHeight += img.Bounds().Dy()
	}

	// Create a new image with the total height
	newImage := image.NewRGBA(image.Rect(0, 0, maxWidth, totalHeight))

	// Draw each image to the new image
	offset := 0
	for _, img := range images {
		draw.Draw(newImage, image.Rect(0, offset, img.Bounds().Dx(), offset+img.Bounds().Dy()), img, image.Point{0, 0}, draw.Src)
		offset += img.Bounds().Dy()
	}

	// Encode new image to PNG
	buf := new(bytes.Buffer)
	err := png.Encode(buf, newImage)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
