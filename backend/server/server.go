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
	addRoutes(mux, jobService)
	var handler http.Handler = mux
	handler = authMiddleware(authService, handler)
	handler = corsMiddleware(config, handler)

	return handler
}

func corsMiddleware(config config.ServerConfig, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.ClientAddress)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Cache-Control, Content-Type, Authorization, Last-Event-ID")
		w.Header().Set("Access-Control-Expose-Headers", "Cache-Control, Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func authMiddleware(authService *services.AuthService, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add authentication logic here
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// remove "Bearer " from the auth header
		authHeader = authHeader[7:]
		user, err := authService.GetUser(r.Context(), authHeader)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := services.SetCtxUser(r.Context(), user)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
