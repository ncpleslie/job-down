package server

import (
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
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
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
