package main

import (
	"log"
	"os"

	cfg "github.com/ncpleslie/job-down/internal/config"
	db "github.com/ncpleslie/job-down/internal/db"
	firebase "github.com/ncpleslie/job-down/internal/firebase"
	server "github.com/ncpleslie/job-down/internal/server"
	services "github.com/ncpleslie/job-down/internal/services"
	storage "github.com/ncpleslie/job-down/internal/storage"
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

	log.Printf("Application listening on %s\n", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Printf("An error occurred. %s\n", err.Error())
	}
}
