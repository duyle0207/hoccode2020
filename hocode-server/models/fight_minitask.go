package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	FightMiniTask struct {
		ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
		Fight_id    string        `json:"fight_id" bson:"fight_id"`
		Minitask_id string        `json:"minitask_id" bson:"minitask_id"`
		Del         bool          `json:"del" bson:"del"`
	}
)
