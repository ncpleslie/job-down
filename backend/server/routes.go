package server

import (
	"encoding/json"

	"fmt"
	"net/http"

	"github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
	"github.com/ncpleslie/application-tracker/services"
)

// addRoutes adds the routes to the provided http.ServeMux.
func addRoutes(
	mux *http.ServeMux,
	jobService *services.JobService,
) {
	mux.Handle("GET /job/{userId}", handleAllJobsGet(jobService))
	mux.Handle("GET /job/{userId}/{jobId}", handleJobGet(jobService))
	mux.Handle("POST /job/{userId}", handleJobPost(jobService))
	mux.Handle("PATCH /job/{userId}/jobId", handleJobPatch(jobService))
	mux.Handle("DELETE /job/{userId}/{jobId}", handleJobDelete(jobService))
	mux.Handle("GET /healthz", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	mux.Handle("/", http.NotFoundHandler())
}

// Returns a handler function for the GET /job/{userId}/{jobId} route.
// It retrieves a job for the provided user ID from the JobService.
//
// GET /job/{userId}/{jobId}
func handleJobGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId := r.PathValue("userId")
		jobId := r.PathValue("jobId")

		job, err := jobService.GetJob(r.Context(), userId, jobId)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error retrieving job. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, job)
	}
}

// Returns a handler function for the GET /job/{userId}/{jobId} route.
// It retrieves all jobs for the provided user ID from the JobService.
//
// GET /job/{userId}
func handleAllJobsGet(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId := r.PathValue("userId")

		jobs, err := jobService.GetJobs(r.Context(), userId)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error retrieving jobs. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, responses.Jobs{Jobs: jobs})
	}
}

// Returns a handler function for the POST /job/{userId}/{jobId} route.
// It creates a new job for the provided user ID from the JobService.
// Expect a response containing a Server-Sent Event.
// The response will contain the job as it is created without a website screenshot url.
// Then it will contain the job with the website screenshot url.
//
// POST /job/{userId}
func handleJobPost(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		userId := r.PathValue("userId")
		job, err := decode[requests.Job](r)
		if err != nil {
			encode(w, r, http.StatusBadRequest, responses.Error{Message: fmt.Sprintf("Error decoding request body. Error: %s", err.Error())})

			return
		}

		jobChan, errChan := jobService.CreateNewJob(r.Context(), userId, job)
		for job := range jobChan {
			encodeSSE(w, job)
		}

		if err := <-errChan; err != nil {
			encodeSSE(w, err)
		}
	}
}

// Returns a handler function for the PATCH /job/{userId}/{jobId} route.
// It updates a job for the provided user ID from the JobService.
//
// PATCH /job/{userId}/{jobId}
func handleJobPatch(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId := r.PathValue("userId")
		jobId := r.PathValue("jobId")

		job, err := decode[requests.Job](r)
		if err != nil {
			encode(w, r, http.StatusBadRequest, responses.Error{Message: fmt.Sprintf("Error decoding request body. Error: %s", err.Error())})

			return
		}

		updateJob, updateErr := jobService.UpdateJob(r.Context(), userId, jobId, job)
		if updateErr != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error updating job. Error: %s", err.Error())})
		}

		encode(w, r, http.StatusOK, updateJob)
	}
}

// Returns a handler function for the DELETE /job/{userId}/{jobId} route.
// It deletes a job for the provided user ID from the JobService.
//
// DELETE /job/{userId}/{jobId}
func handleJobDelete(jobService *services.JobService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userId := r.PathValue("userId")
		jobId := r.PathValue("jobId")

		err := jobService.DeleteJob(r.Context(), userId, jobId)
		if err != nil {
			encode(w, r, http.StatusInternalServerError, responses.Error{Message: fmt.Sprintf("Error deleting job. Error: %s", err.Error())})
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

// Writes the provided value to the http.ResponseWriter.
// And flushes the response.
// For use with Server-Sent Events.
func encodeSSE[T any](w http.ResponseWriter, v T) {
	if err := json.NewEncoder(w).Encode(v); err != nil {
		_ = fmt.Errorf("encode json: %w", err)
		w.(http.Flusher).Flush()
	}

	w.(http.Flusher).Flush()
}

// Writes the provided value to the http.ResponseWriter.
// It sets the status code and content type for the response.
// Will set content type to "application/json".
// It returns an error if the value cannot be encoded.
func encode[T any](w http.ResponseWriter, _ *http.Request, status int, v T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		return fmt.Errorf("encode json: %w", err)
	}

	return nil
}

// Decodes the request body into the provided value.
// It returns an error if the body cannot be decoded.
func decode[T any](r *http.Request) (T, error) {
	var v T
	if err := json.NewDecoder(r.Body).Decode(&v); err != nil {
		return v, fmt.Errorf("decode json: %w", err)
	}

	return v, nil
}
