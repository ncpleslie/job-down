package responses

type Jobs struct {
	Jobs []Job `json:"jobs"`
}

type Job struct {
	Id               string `json:"id"`
	Position         string `json:"position"`
	Company          string `json:"company"`
	Url              string `json:"url"`
	JobImageFilename string `json:"job_image_filename"`
	JobImageUrl      string `json:"job_image_url"`
}
