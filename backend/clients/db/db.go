package db

import (
	"context"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"github.com/ncpleslie/application-tracker/models/entities"
	"google.golang.org/api/iterator"
)

type DB struct {
	Log    *log.Logger
	Client *firestore.Client
}

func Must(app *firebase.App, log *log.Logger) *DB {
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

func (d *DB) AddJob(ctx context.Context, userId string, job entities.Job) (entities.Job, error) {
	job.CreatedAt = time.Now()
	docRef, _, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Add(ctx, job)
	if err != nil {
		d.Log.Println("DB: Error adding job to Firestore: ", err.Error())
		return entities.Job{}, err
	}

	return entities.Job{
		Id:            docRef.ID,
		Company:       job.Company,
		Position:      job.Position,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		CreatedAt:     job.CreatedAt,
		UpdatedAt:     job.UpdatedAt,
		Statuses:      job.Statuses,
	}, nil
}

func (d *DB) GetJob(ctx context.Context, userId string, jobId string) (entities.Job, error) {
	doc, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Doc(jobId).Get(ctx)
	if err != nil {
		d.Log.Println("DB: Error getting job from Firestore: ", err.Error())
		return entities.Job{}, err
	}

	var job entities.Job
	err = doc.DataTo(&job)
	if err != nil {
		d.Log.Println("DB: Error converting Firestore document to Job: ", err.Error())
		return entities.Job{}, err
	}
	job.Id = doc.Ref.ID

	return entities.Job{
		Id:            job.Id,
		Company:       job.Company,
		Position:      job.Position,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		CreatedAt:     job.CreatedAt,
		UpdatedAt:     job.UpdatedAt,
		Statuses:      job.Statuses,
	}, nil
}

func (d *DB) UpdateJob(ctx context.Context, userId string, jobId string, job entities.Job) (entities.Job, error) {
	job.UpdatedAt = time.Now()
	_, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Doc(jobId).Set(ctx, job)
	if err != nil {
		d.Log.Println("DB: Error updating job in Firestore: ", err.Error())
		return entities.Job{}, err
	}

	return entities.Job{
		Id:            jobId,
		Company:       job.Company,
		Position:      job.Position,
		Url:           job.Url,
		ImageFilename: job.ImageFilename,
		CreatedAt:     job.CreatedAt,
		UpdatedAt:     job.UpdatedAt,
		Statuses:      job.Statuses,
	}, nil
}

func (d *DB) GetJobs(ctx context.Context, userId string) ([]entities.Job, error) {
	iter := d.Client.Collection("users").Doc(userId).Collection("jobs").Documents(ctx)
	var jobs []entities.Job
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			d.Log.Println("DB: Error getting jobs from Firestore: ", err.Error())
			return nil, err
		}
		var job entities.Job
		err = doc.DataTo(&job)
		if err != nil {
			d.Log.Println("DB: Error converting Firestore document to Job: ", err.Error())
			return nil, err
		}
		job.Id = doc.Ref.ID
		jobs = append(jobs, job)
	}

	return jobs, nil
}

func (d *DB) DeleteJob(ctx context.Context, userId string, jobId string) error {
	_, err := d.Client.Collection("users").Doc(userId).Collection("jobs").Doc(jobId).Delete(ctx)
	if err != nil {
		d.Log.Println("DB: Error deleting job from Firestore: ", err.Error())
		return err
	}

	return nil
}
