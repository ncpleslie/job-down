package server

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/ncpleslie/application-tracker/config"
	"github.com/ncpleslie/application-tracker/services"
)

// NewServer creates a new http.Handler.
// It sets up the routes and middleware for the server.
func NewServer(
	config config.ServerConfig,
	authService *services.AuthService,
	jobService *services.JobService,
) http.Handler {
	mux := http.NewServeMux()
	// Unauthenticated routes
	mux.Handle("/healthz/", http.StripPrefix("/healthz", addHealthRoutes()))

	// Job routes. Require authentication.
	mux.Handle("/jobs/", http.StripPrefix("/jobs", addJobRoutes(authService, jobService)))

	var handler http.Handler = mux
	handler = cors(config.ClientAddress, handler)

	return handler
}

func addHealthRoutes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		encode(w, r, http.StatusOK, "ok")
	})

	return mux
}

func addJobRoutes(
	authService *services.AuthService,
	jobService *services.JobService,
) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("GET /", handleAllJobsGet(jobService))
	mux.Handle("GET /{jobId}", handleJobGet(jobService))
	mux.Handle("POST /", handleJobPost(jobService))
	mux.Handle("PATCH /{jobId}", handleJobPatch(jobService))
	mux.Handle("DELETE /{jobId}", handleJobDelete(jobService))

	var handler http.Handler = mux
	handler = userContext(authService, handler)

	return handler
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
func encode[T any](w http.ResponseWriter, _ *http.Request, status int, v T) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
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
