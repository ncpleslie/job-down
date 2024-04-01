package server

import (
	"fmt"
	"net/http"

	"github.com/ncpleslie/job-down/models/requests"
	"github.com/ncpleslie/job-down/models/responses"
	"github.com/ncpleslie/job-down/services"
)

// Returns a handler function for the GET /jobs/{jobId} route.
// It retrieves a job for the provided user ID from the JobService.
//
// GET /jobs/{jobId}
func handleJobGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())
		jobId := r.PathValue("jobId")

		job, err := jobService.GetJob(r.Context(), user.UID, jobId)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error retrieving job. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, job)
	}
}

// Returns a handler function for the GET /jobs route.
// It retrieves all jobs for the provided user ID from the JobService.
//
// GET /jobs
func handleAllJobsGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())

		jobs, err := jobService.GetJobs(r.Context(), user.UID)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error retrieving jobs. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, responses.Jobs{Jobs: jobs})
	}
}

// Returns a handler function for the POST /jobs/{jobId} route.
// It creates a new job for the provided user ID from the JobService.
// Expect a response containing a Server-Sent Event.
// The response will contain the job as it is created without a website screenshot url.
// Then it will contain the job with the website screenshot url.
//
// POST /jobs
func handleJobPost(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		job, err := decode[requests.Job](r)
		if err != nil {
			encode(w, r, http.StatusBadRequest, responses.Error{Message: fmt.Sprintf("Error decoding request body. Error: %s", err.Error())})

			return
		}

		jobChan, errChan := jobService.CreateNewJob(r.Context(), user.UID, job)
		for job := range jobChan {
			encodeSSE(w, job)
		}

		for err := range errChan {
			if err != nil {
				encodeSSE(w, err)
			}
		}
	}
}

// Returns a handler function for the PATCH /jobs/{jobId} route.
// It updates a job for the provided user ID from the JobService.
//
// PATCH /jobs/{jobId}
func handleJobPatch(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())
		jobId := r.PathValue("jobId")

		job, err := decode[requests.Job](r)
		if err != nil {
			encode(w, r, http.StatusBadRequest, responses.Error{Message: fmt.Sprintf("Error decoding request body. Error: %s", err.Error())})

			return
		}

		updateJob, updateErr := jobService.UpdateJob(r.Context(), user.UID, jobId, job)
		if updateErr != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error updating job. Error: %s", updateErr.Error())})
		}

		encode(w, r, http.StatusOK, updateJob)
	}
}

// Returns a handler function for the DELETE /jobs/{jobId} route.
// It deletes a job for the provided user ID from the JobService.
//
// DELETE /jobs/{jobId}
func handleJobDelete(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())
		jobId := r.PathValue("jobId")

		err := jobService.DeleteJob(r.Context(), user.UID, jobId)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error deleting job. Error: %s", err.Error())})
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

// Returns a handler function for the GET /jobs/stats route.
// It retrieves stats for the provided user ID from the JobService.
//
// GET /jobs/stats
func handleStatsGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := services.GetCtxUser(r.Context())

		stats, err := jobService.GetStats(r.Context(), user.UID)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error retrieving stats. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, stats)
	}
}
