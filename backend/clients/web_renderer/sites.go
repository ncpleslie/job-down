package webrenderer

import (
	"net/url"
)

type Site struct {
	HostUrl   string
	Name      string
	Selectors []string
}

func GetSite(url *url.URL) Site {
	for _, site := range getSites() {
		if site.HostUrl == url.Host {
			return site
		}
	}

	return Site{}
}

func getSites() []Site {
	return []Site{
		{
			HostUrl: "www.linkedin.com",
			Name:    "LinkedIn",
			Selectors: []string{
				".show-more-less-html__button.show-more-less-button.show-more-less-html__button--more",
			},
		},
	}
}
