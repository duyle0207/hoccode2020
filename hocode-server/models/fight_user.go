package model

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type (
	FightUser struct {
		ID          	bson.ObjectId `json:"id" bson:"_id,omitempty"`
		FightID    		string        `json:"fight_id" bson:"fight_id"`
		UserID 			string        `json:"user_id" bson:"user_id"`
		Point    		int        	  `json:"point" bson:"point"`
		Tried 			int           `json:"tried" bson:"tried"`
		IsUserStart		bool		  `json:"is_user_start" bson:"is_user_start"`
		FinishedTime 	time.Time     `json:"finished_time" bson:"finished_time"`
		StartTime 		time.Time     `json:"start_time" bson:"start_time"`
		EndTime 		time.Time     `json:"end_time" bson:"end_time"`
	}
)

type (
	FightUserRank struct {
		ID          	bson.ObjectId 			`json:"id" bson:"_id,omitempty"`
		Rank 			int        	  			`json:"rank" bson:"rank"`
		Email    		string        			`json:"email" bson:"email"`
		UserInfo		User		  			`json:"user_info" bson:"user_info"`
		MiniTasks		[]*FightUserMinitask    `json:"fight_user_minitask" bson:"fight_user_minitask"`
		Point    		int        	  			`json:"point" bson:"point"`
		IsDone			bool					`json:"is_done" bson:"is_done"`
		Tried 			int           			`json:"tried" bson:"tried"`
		FinishedTime 	time.Time     			`json:"finished_time" bson:"finished_time"`
		CodingTime		int64					`json:"coding_time" bson:"coding_time"`
	}
)

type (
	FightUserInfo struct {
		TotalPublicFight 				int        	  `json:"total_public_fight" bson:"total_public_fight"`
		TotalPrivateFight 				int        	  `json:"total_private_fight" bson:"total_private_fight"`
		TotalJoinedPublicFight    		int        	  `json:"total_public_joined_fight" bson:"total_public_joined_fight"`
		TotalJoinedPrivateFight    		int        	  `json:"total_private_joined_fight" bson:"total_private_joined_fight"`
		UserId 							string           `json:"user_id" bson:"user_id"`
	}
)
