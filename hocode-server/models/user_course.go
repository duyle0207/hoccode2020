package model

import (
	"time"

	"gopkg.in/mgo.v2/bson"
)

type (
	UserCourse struct {
		ID         	bson.ObjectId 	`json:"id" bson:"_id"`
		UserID     	string        	`json:"user_id" bson:"user_id"`
		CourseInfo []*CourseInfo 	`json:"course_info" bson:"course_info"`
		UserPoint	int 			`json:"user_point" bson:"user_point"`
		Timestamp  	time.Time     	`json:"timestamp" bson:"timestamp"`
		Del        	bool          	`json:"del" bson:"del"`
	}
)

type (
	UserCourseLeaderBoard struct {
		UserInfo     		User        	`json:"user_info" bson:"user_info"`
		CourseID     		string        	`json:"course_id" bson:"course_id"`
		UserPoint			int 			`json:"user_point" bson:"user_point"`
		IsCurrentAccount 	bool			`json:"is_current_account" bson:"is_current_account"`
	}
)

type (
	CourseInfo struct {
		CourseID            string `json:"course_id" bson:"_id"`
		CourseName          string `json:"course_name" bson:"course_name"`
		CompletedTasksCount int    `json:"completed_tasks_count" bson:"CompletedTasksCount"`
		ToDoTasksCount      int    `json:"todo_tasks_count" bson:"ToDoTasksCount"`
		TotalTasksCount     int    `json:"total_tasks_count" bson:"TotalTasksCount"`
		PassCourse          bool   `json:"pass_course" bson:"PassCourse"`
		BackgroundImage     string `json:"background_image" bson:"background_image"`
		CodePoint 			int    `json:"code_point" bson:"code_point"`
	}
)

type (
	BodyUC struct {
		CourseID   string `json:"course_id" bson:"course_id"`
		MiniTaskID string `json:"minitask_id" bson:"minitask_id"`
		TaskID     string `json:"task_id" bson:"task_id"`
	}
)

type (
	UserCourseOut struct {
		UserCourse   *UserCourse   `json:"user_course" bson:"user_course"`
		UserMiniTask *UserMiniTask `json:"user_minitask" bson:"user_minitask"`
		NextMiniTask *MiniTask     `json:"next_minitask" bson:"next_minitask"`
		CodePoint    int           `json:"codepoint" bson:"codepoint"`
	}
)

type (
	ChartInfo struct {
		Solved   		int   	`json:"solved" bson:"solved"`
		Todo			int 	`json:"todo" bson:"todo"`
		Attempted   	int     `json:"attempted" bson:"attempted"`
		Easy 			int 	`json:"easy" bson:"easy"`
		Medium 			int 	`json:"medium" bson:"medium"`
		Hard 			int 	`json:"hard" bson:"hard"`
		TotalEasy 		int 	`json:"total_easy" bson:"total_easy"`
		TotalMedium 	int 	`json:"total_medium" bson:"total_medium"`
		TotalHard 		int 	`json:"total_hard" bson:"total_hard"`
	}
)

