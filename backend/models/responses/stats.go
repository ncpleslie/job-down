package responses

type Stats struct {
	Total      int   `json:"total"`
	Current    *Stat `json:"current"`
	Historical *Stat `json:"historical"`
}

type Stat struct {
	Applied   int `json:"applied"`
	Interview int `json:"interview"`
	Offer     int `json:"offer"`
	Rejected  int `json:"rejected"`
	Other     int `json:"other"`
	Accepted  int `json:"accepted"`
	Withdrawn int `json:"withdrawn"`
}
