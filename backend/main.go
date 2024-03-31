package main

import (
	"log"
	"net"
	"net/http"
	"os"

	firebase "github.com/ncpleslie/job-down/clients"
	db "github.com/ncpleslie/job-down/clients/db"
	storage "github.com/ncpleslie/job-down/clients/storage"
	cfg "github.com/ncpleslie/job-down/config"
	server "github.com/ncpleslie/job-down/server"
	"github.com/ncpleslie/job-down/services"
)

func main() {
	log := log.New(os.Stdout, "application-tracker: ", log.LstdFlags|log.Lshortfile)
	log.Println("Application initializing...")
	config := cfg.MustGenerateConfig()

	app := firebase.Must(config.Firebase, log)
	storage := storage.Must(app, log)
	db := db.Must(app, log)
	defer db.Client.Close()

	authService := services.NewAuthService(app, log)
	jobService := services.NewJobService(storage, db, log)

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
