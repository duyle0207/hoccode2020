package model


type (
	InviteUserInfo struct {
		Host    string        `json:"host" bson:"host"`
		User    string        `json:"user" bson:"user"`
		Link   	string        `json:"link" bson:"link"`
	}
)
