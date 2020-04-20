package model

import "gopkg.in/mgo.v2/bson"

type (
	CourseType struct {
		ID         	bson.ObjectId `json:"id" bson:"_id,omitempty"`
		CourseType 	string        `json:"course_type" bson:"course_type"`
	}
)
