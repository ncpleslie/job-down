package webrenderer

import (
	"context"
	"fmt"
	"time"

	"github.com/chromedp/chromedp"
)

type Renderer struct {
	Ctx    context.Context
	Cancel context.CancelFunc
}

func NewRenderer() *Renderer {
	ctx, cancel := context.WithCancel(context.Background())
	return &Renderer{
		Ctx:    ctx,
		Cancel: cancel,
	}
}

func (r Renderer) Screenshot(parent context.Context, o ScreenshotOptions) (b []byte, err error) {
	return r.retry(parent, r.screenshot, o, o.Retries)
}

func (r Renderer) screenshot(parent context.Context, o ScreenshotOptions) (b []byte, err error) {
	timeoutCtx, cancel := context.WithTimeout(parent, time.Until(time.Now().Add(o.EndDelay)))
	defer cancel()

	ctx, cancel := chromedp.NewRemoteAllocator(timeoutCtx, "ws://localhost:9222/")
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)
	defer cancel()

	if err = chromedp.Run(ctx, chromedp.Tasks{
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
	}); err != nil {
		fmt.Println("Error: ", err.Error())
	}

	return b, err
}

func (r Renderer) retry(ctx context.Context, f func(context.Context, ScreenshotOptions) ([]byte, error), o ScreenshotOptions, maxRetries int) ([]byte, error) {
	for i := range maxRetries {
		b, err := f(ctx, o)
		if err != nil {
			fmt.Println("Error: ", err.Error())
			if i == maxRetries-1 {
				return nil, err
			}
			fmt.Println("Retrying...")
			continue
		}

		return b, nil
	}

	return nil, fmt.Errorf("max retries reached")
}
