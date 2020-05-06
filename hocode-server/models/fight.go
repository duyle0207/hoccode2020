package model

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type (
	Fight struct {
		ID             bson.ObjectId    `json:"id" bson:"_id,omitempty"`
		Fight_Name     string           `json:"fight_name" bson:"fight_name"`
		Numbers_std    int              `json:"numbers_std" bson:"numbers_std"`
		Fight_Desc     string           `json:"fight_desc" bson:"fight_desc"`
		Background_img string           `json:"backgroud_img" bson:"backgroud_img"`
		Fight_Type     string			`json:"fight_type" bson:"fight_type"`
		Time_start     time.Time        `json:"time_start" bson:"time_start"`
		Time_end       time.Time        `json:"time_end" bson:"time_end"`
		Users          []*User          `json:"users" bson:"users"`
		IsUserRegister bool				`json:"is_user_register" bson:"is_user_register"`
		Minitasks      []*MiniTask      `json:"minitasks" bson:"minitasks"`
		User_created   string           `json:"user_created" bson:"user_created"`
		Fight_minitask []*FightMiniTask `json:"fight_minitask" bson:"fight_minitask"`
		Timestamp time.Time `json:"timestamp" bson:"timestamp"`
		Del            bool             `json:"del" bson:"del"`
	}
)
