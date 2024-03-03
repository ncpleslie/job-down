package webrenderer

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"time"

	"github.com/chromedp/chromedp"
	"github.com/ncpleslie/application-tracker/config"
)

type Renderer struct {
	Ctx    context.Context
	Cancel context.CancelFunc
	Config config.ScreenshotConfig
	Log    *log.Logger
}

func NewRenderer(config config.ScreenshotConfig, log *log.Logger) *Renderer {
	ctx, cancel := context.WithCancel(context.Background())
	return &Renderer{
		Ctx:    ctx,
		Cancel: cancel,
		Config: config,
		Log:    log,
	}
}

func (r Renderer) Screenshot(parent context.Context, url *url.URL) (b []byte, err error) {
	o := ScreenshotOptions{
		URL:      url,
		Width:    r.Config.Width,
		Height:   r.Config.Height,
		Delay:    r.Config.Delay,
		EndDelay: r.Config.EndDelay,
	}

	site := GetSite(url)
	if site.Selectors != nil {
		o.Clicks = site.Selectors
	}

	resultChan := make(chan []byte, 1)
	errorChan := make(chan error, 1)
	go func() {
		r.Log.Println("WebRenderer: Taking screenshot of ", url.String())
		b, err := r.retry(parent, r.screenshot, o, r.Config.Retries)
		resultChan <- b
		errorChan <- err
	}()

	return <-resultChan, <-errorChan

	// return r.retry(parent, r.screenshot, o, r.Config.Retries)
}

func (r Renderer) screenshot(parent context.Context, o ScreenshotOptions) (b []byte, err error) {
	timeoutCtx, cancel := context.WithTimeout(parent, time.Until(time.Now().Add(o.EndDelay)))
	defer cancel()

	ctx, cancel := chromedp.NewRemoteAllocator(timeoutCtx, r.Config.HeadlessUrl)
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)
	defer cancel()

	err = chromedp.Run(ctx, chromedp.Tasks{
		chromedp.EmulateViewport(o.Width, o.Height),
		chromedp.Navigate(o.URL.String()),
		chromedp.Sleep(o.Delay),
		chromedp.ActionFunc(func(ctx context.Context) error {

			if len(o.Clicks) > 0 {
				for _, click := range o.Clicks {
					chromedp.Click(click, chromedp.NodeVisible).Do(ctx)
				}
			}

			return chromedp.FullScreenshot(&b, 100).Do(ctx)
		}),
	})

	return b, err
}

func (r Renderer) retry(ctx context.Context, f func(context.Context, ScreenshotOptions) ([]byte, error), o ScreenshotOptions, maxRetries int) ([]byte, error) {
	for i := range maxRetries {
		b, err := f(ctx, o)
		if err != nil {
			r.Log.Println("WebRenderer Error: ", err.Error())

			if i == maxRetries-1 {
				r.Log.Println("WebRenderer failed with max retries reached")

				return nil, err
			}

			r.Log.Println("WebRenderer failed but retrying on attempt: ", i+1)
			continue
		}

		return b, nil
	}

	return nil, fmt.Errorf("WebRenderer max retries reached")
}
