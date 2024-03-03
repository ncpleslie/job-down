package db

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/ncpleslie/application-tracker/models/requests"
	"github.com/ncpleslie/application-tracker/models/responses"
	"google.golang.org/api/iterator"
)

type DB struct {
	Log    *log.Logger
	Client *firestore.Client
}

func NewClient(app *firebase.App, log *log.Logger) *DB {
	ctx := context.Background()
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Panicln("Firestore Client failed to create client: ", err.Error())
	}

	return &DB{
		Log:    log,
		Client: client,
	}
}

func (d *DB) AddJob(ctx context.Context, userId string, job requests.Job) (*firestore.DocumentRef, error) {
	docRef, _, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Add(ctx, job)
	if err != nil {
		d.Log.Println("DB: Error adding job to Firestore: ", err.Error())
		return nil, err
	}

	return docRef, nil
}

func (d *DB) UpdateJob(ctx context.Context, userId string, jobId string, job requests.Job) error {
	_, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Doc(jobId).Set(ctx, job)
	if err != nil {
		d.Log.Println("DB: Error updating job in Firestore: ", err.Error())
		return err
	}

	return nil
}

func (d *DB) GetJobs(ctx context.Context, userId string) ([]responses.Job, error) {
	iter := d.Client.Collection("users").Doc(userId).Collection("jobs").Documents(ctx)
	var jobs []responses.Job
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			d.Log.Println("DB: Error getting jobs from Firestore: ", err.Error())
			return nil, err
		}
		var job responses.Job
		doc.DataTo(&job)
		job.Id = doc.Ref.ID
		jobs = append(jobs, job)
	}

	return jobs, nil
}