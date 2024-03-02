package webrenderer

import (
	"net/url"
	"time"
)

type ScreenshotOptions struct {
	URL      *url.URL
	Width    int64
	Height   int64
	Delay    time.Duration
	EndDelay time.Duration
	Clicks   []string
	Retries  int
}
