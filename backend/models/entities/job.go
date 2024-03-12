package entities

import (
	"time"

	"github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
)

type Job struct {
	Id            string
	Position      string
	Company       string
	Url           string
	ImageFilename string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Status        string
	Notes         string
}

func NewJobEntity(job requests.Job) Job {
	return Job{
		Position: job.Position,
		Company:  job.Company,
		Url:      job.Url,
		Status:   job.Status,
		Notes:    job.Notes,
	}
}

func (job Job) ToResponse() responses.Job {
	return responses.Job{
		Id:            job.Id,
		Position:      job.Position,
		Company:       job.Company,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		CreatedAt:     job.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     job.UpdatedAt.Format(time.RFC3339),
		Status:        job.Status,
		Notes:         job.Notes,
	}
}
