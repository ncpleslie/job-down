package services

import (
	"context"
	"net/url"
	"os"
	"time"

	requests "github.com/ncpleslie/application-tracker/models/requests"
	web "github.com/ncpleslie/application-tracker/web_renderer"
)

type JobService struct {
	WebRenderer *web.Renderer
}

func NewJobService(renderer *web.Renderer) *JobService {
	return &JobService{
		WebRenderer: renderer,
	}
}

func (s *JobService) CreateNewJob(ctx context.Context, userId string, job requests.Job) error {
	u, err := url.Parse(job.Url)
	if err != nil {
		return err
	}

	b, err := s.getScreenshot(ctx, u)
	if err != nil {
		return err
	}

	os.WriteFile("screenshot.png", b, 0644)

	return nil
}

func (s *JobService) getScreenshot(ctx context.Context, u *url.URL) ([]byte, error) {
	o := web.ScreenshotOptions{
		URL:      u,
		Width:    1920,
		Height:   1080,
		Delay:    10 * time.Second,
		EndDelay: 20 * time.Second,
		Retries:  3,
	}

	site := web.GetSite(u.Host)
	if site.URL != "" {
		o.Clicks = site.Selector
	}

	return s.WebRenderer.Screenshot(ctx, o)
}
