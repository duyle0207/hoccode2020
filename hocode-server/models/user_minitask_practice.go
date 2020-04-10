package model

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type (
	UserMinitaskPractice struct {
		ID         	bson.ObjectId 	`json:"id" bson:"_id"`
		UserID     	string        	`json:"user_id" bson:"user_id"`
		MiniTaskID	string			`json:"minitask_id" bson:"minitask_id"`
		Status		string			`json:"status" bson:"status"`
		UserCode   	string			`json:"user_code" bson:"user_code"`
		Timestamp  	time.Time     	`json:"timestamp" bson:"timestamp"`
		Del        	bool          	`json:"del" bson:"del"`
	}
)
