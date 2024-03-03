package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"github.com/ncpleslie/application-tracker/config"
	"google.golang.org/api/option"
)

func NewApp(config config.FirebaseConfig, log *log.Logger) *firebase.App {
	fbConfig := &firebase.Config{
		StorageBucket: config.StorageBucket,
		ProjectID:     config.ProjectID,
	}
	opt := option.WithCredentialsFile(config.CredentialPath)
	app, err := firebase.NewApp(context.Background(), fbConfig, opt)
	if err != nil {
		log.Panicln("Storage Client failed to create Firebase App: ", err.Error())
	}

	return app
}
