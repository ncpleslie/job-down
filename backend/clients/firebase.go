package firebase

import (
	"context"
	"log"

	b64 "encoding/base64"

	firebase "firebase.google.com/go/v4"
	"github.com/ncpleslie/job-down/config"
	"google.golang.org/api/option"
)

func Must(config config.FirebaseConfig, log *log.Logger) *firebase.App {
	fbConfig := &firebase.Config{
		StorageBucket: config.StorageBucket,
		ProjectID:     config.ProjectID,
	}

	cred, _ := b64.StdEncoding.DecodeString(config.CredentialsBase64)
	opt := option.WithCredentialsJSON(cred)
	app, err := firebase.NewApp(context.Background(), fbConfig, opt)
	if err != nil {
		log.Panicln("FB Client failed to create Firebase App: ", err.Error())
	}

	return app
}
