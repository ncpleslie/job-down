package requests

type Job struct {
	Position         string `json:"position"`
	Company          string `json:"company"`
	Url              string `json:"url"`
	JobImageFilename string `json:"job_image_filename"`
}
