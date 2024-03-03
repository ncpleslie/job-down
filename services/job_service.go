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

	for i, job := range jobs {
		if job.JobImageFilename != "" {
			jobImageUrl, err := s.Storage.GetDownloadURL(ctx, job.JobImageFilename)
			if err != nil {
				return nil, err
			}
			jobs[i].JobImageUrl = jobImageUrl
		}
	}

	return jobs, nil
}

func (s *JobService) CreateNewJob(ctx context.Context, userId string, job requests.Job) error {
	docRef, err := s.DB.AddJob(ctx, userId, job)
	if err != nil {
		return err
	}
	u, err := url.Parse(job.Url)
	if err != nil {
		return err
	}

	b, err := s.WebRenderer.Screenshot(ctx, u)
	if err != nil {
		return err
	}

	filename := fmt.Sprintf("%s/%s.png", userId, uuid.New().String())
	err = s.Storage.UploadFile(ctx, filename, b)
	if err != nil {
		return err
	}

	job.JobImageFilename = filename
	err = s.DB.UpdateJob(ctx, userId, docRef.ID, job)
	if err != nil {
		return err
	}

	return nil
}
