package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	Task_Minitask struct {
		ID             	bson.ObjectId `json:"id" bson:"_id,omitempty"`
		TaskID 			string        `json:"task_id" bson:"task_id"`
		MiniTaskID 		string        `json:"mini_task_id" bson:"mini_task_id"`
		Del             bool   `json:"del" bson:"del"`
	}
)
