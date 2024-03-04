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

func (s *JobService) GetJob(ctx context.Context, userId string, jobId string) (responses.Job, error) {
	job, err := s.DB.GetJob(ctx, userId, jobId)
	if err != nil {
		return responses.Job{}, err
	}

	return job.ToResponse(), nil
}

func (s *JobService) GetJobs(ctx context.Context, userId string) ([]responses.Job, error) {
	jobs, err := s.DB.GetJobs(ctx, userId)
	if err != nil {
		return nil, err
	}

	// Convert job entities to job responses
	var jobResponses []responses.Job
	for _, job := range jobs {
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

		jobChan <- updatedJobEntity.ToResponse()
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

	return updatedJobEntity.ToResponse(), nil
}

func (s *JobService) DeleteJob(ctx context.Context, userId string, jobId string) error {
	return s.DB.DeleteJob(ctx, userId, jobId)
}
