package webrenderer

type Site struct {
	URL      string
	Name     string
	Selector []string
}

func GetSite(url string) Site {
	for _, site := range getSites() {
		if site.URL == url {
			return site
		}
	}

	return Site{}
}

func getSites() []Site {
	return []Site{
		{
			URL:  "www.linkedin.com",
			Name: "LinkedIn",
			Selector: []string{
				".show-more-less-html__button.show-more-less-button.show-more-less-html__button--more",
			},
		},
	}
}
