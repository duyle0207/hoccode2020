package model

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type (
	Task struct {
		ID              bson.ObjectId `json:"id" bson:"_id,omitempty"`
		TaskName        string        `json:"task_name" bson:"task_name"`
		BackgroundImage string        `json:"background_image" bson:"background_image"`
		CourseId        string        `json:"course_id" bson:"course_id"`
		Minitasks       []*MiniTask   `json:"minitasks" bson:"minitasks"`
		Timestamp       time.Time     `json:"timestamp" bson:"timestamp"`
		Del             bool          `json:"del" bson:"del"`
	}
)

type (
	CoursePassInfo struct {
		CourseID		string     	`json:"course_id" bson:"course_id"`
		MinitaskSoved 	int        	`json:"minitask_solved" bson:"minitask_solved"`
		TotalMiniTask	int        	`json:"total_minitask" bson:"total_minitask"`
		UserCodePoint	int			`json:"user_code_point" bson:"user_code_point"`
		ToTalPoint		int 		`json:"total_point" bson:"total_point"`
		IsCodePass		bool		`json:"isCodePass" bson:"isCodePass"`
	}
)
