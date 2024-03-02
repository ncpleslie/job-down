package server

import (
	"net/http"

	"github.com/ncpleslie/application-tracker/services"
)

// NewServer creates a new http.Handler.
// It sets up the routes and middleware for the server.
func NewServer(
	jobService *services.JobService,
) http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux, jobService)
	var handler http.Handler = mux
	// Add middleware here

	return handler
}
