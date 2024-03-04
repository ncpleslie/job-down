package responses

type Jobs struct {
	Jobs []Job `json:"jobs"`
}

type Job struct {
	Id            string `json:"id"`
	Position      string `json:"position"`
	Company       string `json:"company"`
	Url           string `json:"url"`
	ImageFilename string `json:"image_filename"`
	ImageUrl      string `json:"image_url"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	Status        string `json:"status"`
}
