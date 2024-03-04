package entities

import (
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
	CreatedAt     string
	UpdatedAt     string
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
		CreatedAt:     job.CreatedAt,
		UpdatedAt:     job.UpdatedAt,
		Status:        job.Status,
	}
}
