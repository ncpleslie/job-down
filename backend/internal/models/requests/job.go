package requests

type Job struct {
	Position string `json:"position"`
	Company  string `json:"company"`
	Url      string `json:"url"`
	Status   string `json:"status"`
	Notes    string `json:"notes"`
	Image    string `json:"image"`
}
