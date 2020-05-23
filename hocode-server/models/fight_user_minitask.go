package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	FightUserMinitask struct {
		ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
		Fight_id    string        `json:"fight_id" bson:"fight_id"`
		User_id     string        `json:"user_id" bson:"user_id"`
		Minitask_id string        `json:"minitask_id" bson:"minitask_id"`
		Status      string        `json:"status" bson:"status"`
		Tried       int           `json:"tried" bson:"tried"`
		Point		int 		  `json:"point" bson:"point"`
		Start_time  string        `json:"start_time" bson:"start_time"`
		End_time    string        `json:"end_time" bson:"end_time"`
	}
)
