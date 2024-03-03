package services

import (
	"context"
	"fmt"
	"log"
	"net/url"

	"github.com/google/uuid"
	"github.com/ncpleslie/application-tracker/clients/db"
	store "github.com/ncpleslie/application-tracker/clients/storage"
	web "github.com/ncpleslie/application-tracker/clients/web_renderer"
	"github.com/ncpleslie/application-tracker/models/entities"
	requests "github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
)

type JobService struct {
	WebRenderer *web.Renderer
	Storage     *store.Storage
	DB          *db.DB
	Log         *log.Logger
}

func NewJobService(renderer *web.Renderer, storage *store.Storage, db *db.DB, log *log.Logger) *JobService {
	return &JobService{
		WebRenderer: renderer,
		Storage:     storage,
		DB:          db,
		Log:         log,
	}
}

func (s *JobService) GetJobs(ctx context.Context, userId string) ([]responses.Job, error) {
	jobs, err := s.DB.GetJobs(ctx, userId)
	if err != nil {
		return nil, err
	}

	// Convert job entities to job responses
	var jobResponses []responses.Job
	for _, job := range jobs {
		jobResponses = append(jobResponses, responses.Job{
			Id:            job.Id,
			Position:      job.Position,
			Company:       job.Company,
			Url:           job.Url,
			ImageFilename: job.ImageFilename,
			ImageUrl:      job.ImageUrl,
		})
	}

	return jobResponses, nil
}

func (s *JobService) CreateNewJob(ctx context.Context, userId string, job requests.Job) (<-chan responses.Job, <-chan error) {
	jobChan := make(chan responses.Job)
	errChan := make(chan error, 1)

	go func() {
		defer close(jobChan)
		defer close(errChan)

		jobEntity, err := s.DB.AddJob(ctx, userId, entities.Job{
			Position: job.Position,
			Company:  job.Company,
			Url:      job.Url,
		})

		if err != nil {
			errChan <- err
			return
		}

		jobChan <- responses.Job{
			Id:            jobEntity.Id,
			Position:      jobEntity.Position,
			Company:       jobEntity.Company,
			Url:           jobEntity.Url,
			ImageFilename: jobEntity.ImageFilename,
			ImageUrl:      jobEntity.ImageUrl,
		}

		u, err := url.Parse(jobEntity.Url)
		if err != nil {
			errChan <- err
			return
		}

		b, err := s.WebRenderer.Screenshot(ctx, u)
		if err != nil {
			errChan <- err
			return
		}

		filename := fmt.Sprintf("%s/%s.png", userId, uuid.New().String())
		downloadUrl, err := s.Storage.UploadFile(ctx, filename, b)
		if err != nil {
			errChan <- err
			return
		}

		jobEntity.ImageFilename = filename
		jobEntity.ImageUrl = downloadUrl
		updatedJobEntity, err := s.DB.UpdateJob(ctx, userId, jobEntity.Id, jobEntity)
		if err != nil {
			errChan <- err
			return
		}

		jobChan <- responses.Job{
			Id:            updatedJobEntity.Id,
			Position:      updatedJobEntity.Position,
			Company:       updatedJobEntity.Company,
			Url:           updatedJobEntity.Url,
			ImageFilename: updatedJobEntity.ImageFilename,
			ImageUrl:      updatedJobEntity.ImageUrl,
		}
	}()

	return jobChan, errChan
}
