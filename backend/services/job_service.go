package services

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"

	"github.com/ncpleslie/application-tracker/clients/db"
	store "github.com/ncpleslie/application-tracker/clients/storage"
	"github.com/ncpleslie/application-tracker/models/entities"
	requests "github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
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

		jobEntity, err := s.DB.AddJob(ctx, userId, entities.NewJobEntity(job))
		if err != nil {
			errChan <- err
			return
		}

		jobChan <- jobEntity.ToResponse()

		if len(job.Image) == 0 {
			return
		}

		b, err := base64.StdEncoding.DecodeString(job.Image[22:])
		if err != nil {
			log.Println("Error decoding base64 image: ", err)
			errChan <- err
			return
		}

		filename := fmt.Sprintf("%s/%s.png", userId, jobEntity.Id)
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

	jobEntity.Position = job.Position
	jobEntity.Company = job.Company
	jobEntity.Url = job.Url
	jobEntity.Status = job.Status

	// TOOD: Check if Job URL has changed and update screenshot

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
	s.Storage.DeleteFile(ctx, fmt.Sprintf("%s/%s.png", userId, jobId))

	return s.DB.DeleteJob(ctx, userId, jobId)
}
