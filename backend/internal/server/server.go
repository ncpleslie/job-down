package server

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"

	"github.com/ncpleslie/job-down/internal/config"
	"github.com/ncpleslie/job-down/internal/services"
)

type Server struct {
	authService *services.AuthService
	jobService  *services.JobService
	config      config.ServerConfig
}

// NewServer creates a new http.Server.
// It sets up the routes and middleware for the server.
func NewServer(
	config config.ServerConfig,
	authService *services.AuthService,
	jobService *services.JobService,
) *http.Server {
	NewServer := &Server{
		authService: authService,
		jobService:  jobService,
		config:      config,
	}

	httpServer := &http.Server{
		Addr:    net.JoinHostPort(NewServer.config.Host, NewServer.config.Port),
		Handler: NewServer.RegisterRouters(),
	}

	return httpServer
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
