package model

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type (
	Course struct {
		ID         bson.ObjectId `json:"id" bson:"_id,omitempty"`
		CourseName string        `json:"course_name" bson:"course_name"`
		// Name            string     `json:"name" bson:"name"`
		TaskSolved      TaskSolved `json:"task_solved" bson:"task_solved"`
		BackgroundImage string     `json:"background_image" bson:"background_image"`
		UserCreate      string     `json:"user_create" bson:"user_create"`
		Rating          []*float64 `json:"rating" bson:"rating"`
		RatingValue     float64    `json:"rating_value" bson:"rating_value"`
		CourseDesc      string     `json:"course_desc" bson:"course_desc"`

		StartTime time.Time `json:"start_time" bson:"start_time"`
		EndTime   time.Time `json:"end_time" bson:"end_time"`

		CourseType string `json:"course_type" bson:"course_type"`

		TotalMinitask int       `json:"total_minitask" bson:"total_minitask"`
		Tasks         []*Task   `json:"tasks" bson:"tasks"`
		Timestamp     time.Time `json:"timestamp" bson:"timestamp"`
		Del           bool      `json:"del" bson:"del"`

		// set status to public course.
		Status string `json:"status" bson:"status"`
		Agree  bool   `json:"agree" bson:"agree"`

		NumbersLike int `json:"numbers_like" bson:"numbers_like"`
	}
)
type (
	TaskSolved struct {
		// ID            bson.ObjectId `json:"id" bson:"_id,omitempty"`
		TaskCount     int       `json:"task_count" bson:"task_count"`
		TasksComplete int       `json:"tasks_complete" bson:"tasks_complete"`
		Timestamp     time.Time `json:"timestamp" bson:"timestamp"`
	}

	ReviewCourse struct {
		User    *User   `json:"user" bson:"user"`
		Courses *Course `json:"course" bson:"course"`
	}
)
