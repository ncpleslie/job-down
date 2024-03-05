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
	ImageUrl      string
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Status        string
}

func NewJobEntity(job requests.Job) Job {
	return Job{
		Position: job.Position,
		Company:  job.Company,
		Url:      job.Url,
		Status:   job.Status,
	}
}

func (job Job) ToResponse() responses.Job {
	return responses.Job{
		Id:            job.Id,
		Position:      job.Position,
		Company:       job.Company,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		ImageUrl:      job.ImageUrl,
		CreatedAt:     job.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     job.UpdatedAt.Format(time.RFC3339),
		Status:        job.Status,
	}
}
