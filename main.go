package main

import (
	"log"
	"net"
	"net/http"

	server "github.com/ncpleslie/application-tracker/server"
	"github.com/ncpleslie/application-tracker/services"
	web "github.com/ncpleslie/application-tracker/web_renderer"
)

func main() {
	renderer := web.NewRenderer()
	defer renderer.Cancel()
	srv := server.NewServer(services.NewJobService(renderer))
	httpServer := &http.Server{
		Addr:    net.JoinHostPort("0.0.0.0", "8080"),
		Handler: srv,
	}

	log.Printf("listening on %s\n", httpServer.Addr)
	if err := httpServer.ListenAndServe(); err != nil {
		log.Printf("An error occurred. %s\n", err.Error())
	}
}
