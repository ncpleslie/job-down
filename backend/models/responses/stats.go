package responses

type Stats struct {
	TotalJobs  int       `json:"totalJobs"`
	Current    StatTrack `json:"current"`
	Historical StatTrack `json:"historical"`
}

type StatTrack struct {
	Applied   int `json:"applied"`
	Interview int `json:"interview"`
	Offer     int `json:"offer"`
	Rejected  int `json:"rejected"`
	Other     int `json:"other"`
	Accepted  int `json:"accepted"`
}
