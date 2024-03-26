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
	Statuses      []Status
	Notes         string
}

type Status struct {
	Status    string
	CreatedAt time.Time
}

func NewStatusEntity(status string) Status {
	return Status{
		Status:    status,
		CreatedAt: time.Now(),
	}
}

func (status Status) ToResponse() responses.Status {
	return responses.Status{
		Status:    status.Status,
		CreatedAt: status.CreatedAt.Format(time.RFC3339),
	}
}

func NewJobEntity(job requests.Job, statuses []Status) Job {
	return Job{
		Position: job.Position,
		Company:  job.Company,
		Url:      job.Url,
		Statuses: statuses,
		Notes:    job.Notes,
	}
}

func (job Job) ToResponse() responses.Job {
	statuses := make([]responses.Status, len(job.Statuses))
	for i, status := range job.Statuses {
		statuses[i] = status.ToResponse()
	}

	return responses.Job{
		Id:            job.Id,
		Position:      job.Position,
		Company:       job.Company,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		CreatedAt:     job.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     job.UpdatedAt.Format(time.RFC3339),
		Statuses:      statuses,
		Notes:         job.Notes,
	}
}
