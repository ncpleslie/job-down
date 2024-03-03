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
	config := cfg.GenerateConfig()
	renderer := web.NewRenderer(config.Screenshot, log)
	defer renderer.Cancel()

	app := firebase.NewApp(config.Firebase, log)
	storage := storage.NewClient(app, log)
	db := db.NewClient(app, log)
	defer db.Client.Close()

	srv := server.NewServer(services.NewJobService(renderer, storage, db, log))
	httpServer := &http.Server{
		Addr:    net.JoinHostPort(config.Server.Host, config.Server.Port),
		Handler: srv,
	}

	log.Printf("listening on %s\n", httpServer.Addr)
	if err := httpServer.ListenAndServe(); err != nil {
		log.Printf("An error occurred. %s\n", err.Error())
	}
}
