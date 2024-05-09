package server

import (
	"net/http"
	"strings"

	"github.com/ncpleslie/job-down/internal/services"
)

func cors(clientAddress string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", clientAddress)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Cache-Control, Content-Type, Authorization, Last-Event-ID")
		w.Header().Set("Access-Control-Expose-Headers", "Cache-Control, Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func userContext(authService *services.AuthService, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		authHeader = strings.TrimPrefix(authHeader, "Bearer ")
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
