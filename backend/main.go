package main

import (
	"log"
	"net"
	"net/http"
	"os"

	firebase "github.com/ncpleslie/application-tracker/clients"
	db "github.com/ncpleslie/application-tracker/clients/db"
	storage "github.com/ncpleslie/application-tracker/clients/storage"
	web "github.com/ncpleslie/application-tracker/clients/web_renderer"
	cfg "github.com/ncpleslie/application-tracker/config"
	server "github.com/ncpleslie/application-tracker/server"
	"github.com/ncpleslie/application-tracker/services"
)

func main() {
	log := log.New(os.Stdout, "application-tracker: ", log.LstdFlags|log.Lshortfile)
	log.Println("Application starting...")
	config := cfg.MustGenerateConfig()
	renderer := web.NewRenderer(config.Screenshot, log)
	defer renderer.Cancel()

	app := firebase.Must(config.Firebase, log)
	storage := storage.Must(app, log)
	db := db.Must(app, log)
	defer db.Client.Close()

	authService := services.NewAuthService(app, log)
	jobService := services.NewJobService(renderer, storage, db, log)

	srv := server.NewServer(config.Server, authService, jobService)
	httpServer := &http.Server{
		Addr:    net.JoinHostPort(config.Server.Host, config.Server.Port),
		Handler: srv,
	}

	log.Printf("Application listening on %s\n", httpServer.Addr)
	if err := httpServer.ListenAndServe(); err != nil {
		log.Printf("An error occurred. %s\n", err.Error())
	}
}
