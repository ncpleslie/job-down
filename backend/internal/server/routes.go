package server

import (
	"net/http"
)

// RegisterRouters sets up the routes and middleware for the server.
// It returns an http.Handler that can be used with http.Server.
func (s *Server) RegisterRouters() http.Handler {
	mux := http.NewServeMux()
	// Unauthenticated routes
	mux.Handle("/healthz/", http.StripPrefix("/healthz", s.addHealthRoutes()))

	// Job routes. Require authentication.
	mux.Handle("/jobs/", http.StripPrefix("/jobs", s.addJobRoutes()))

	var handler http.Handler = mux
	handler = cors(s.config.ClientAddress, handler)

	return handler
}

// AddHealthRoutes adds the health routes to the provided http.ServeMux.
// All health routes are prefixed with "/healthz".
// TODO: Make this more useful by pinging db, etc.
func (s *Server) addHealthRoutes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		encode(w, r, http.StatusOK, "ok")
	})

	return mux
}

// AddJobRoutes adds the job routes to the provided http.ServeMux.
// All job routes are prefixed with "/jobs".
func (s *Server) addJobRoutes() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("GET /", handleAllJobsGet(s.jobService))
	mux.Handle("GET /{jobId}", handleJobGet(s.jobService))
	mux.Handle("POST /", handleJobPost(s.jobService))
	mux.Handle("PATCH /{jobId}", handleJobPatch(s.jobService))
	mux.Handle("DELETE /{jobId}", handleJobDelete(s.jobService))
	mux.Handle("GET /stats", handleStatsGet(s.jobService))

	var handler http.Handler = mux
	handler = userContext(s.authService, handler)

	return handler
}
