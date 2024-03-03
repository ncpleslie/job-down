package storage

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	storage "firebase.google.com/go/v4/storage"
)

type Storage struct {
	Log    *log.Logger
	Client *storage.Client
}

func NewClient(app *firebase.App, log *log.Logger) *Storage {
	client, err := app.Storage(context.Background())
	if err != nil {
		log.Panicln("Storage Client failed to create client: ", err.Error())
	}

	return &Storage{
		Log:    log,
		Client: client,
	}
}

func (s *Storage) UploadFile(ctx context.Context, filename string, data []byte) (string, error) {
	bucket, err := s.Client.DefaultBucket()
	if err != nil {
		return "", err
	}

	obj := bucket.Object(filename)
	w := obj.NewWriter(ctx)
	if _, err := w.Write(data); err != nil {
		log.Println("Storage: Error writing to storage: ", err.Error())
		return "", err
	}
	if err := w.Close(); err != nil {
		log.Println("Storage: Error closing storage: ", err.Error())
		return "", err
	}

	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return "", err
	}

	return attrs.MediaLink, nil

}

func (s *Storage) GetDownloadURL(ctx context.Context, filename string) (string, error) {
	bucket, err := s.Client.DefaultBucket()
	if err != nil {
		return "", err
	}

	obj := bucket.Object(filename)
	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return "", err
	}

	return attrs.MediaLink, nil
}
