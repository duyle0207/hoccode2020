package model

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	FightUser struct {
		ID          	bson.ObjectId `json:"id" bson:"_id,omitempty"`
		FightID    		string        `json:"fight_id" bson:"fight_id"`
		UserID 			string        `json:"user_id" bson:"user_id"`
		Point    		int        	  `json:"point" bson:"point"`
		Tried 			int           `json:"tried" bson:"tried"`
		FinishedTime 	string        `json:"finished_time" bson:"finished_time"`
	}
)

type (
	FightUserRank struct {
		ID          	bson.ObjectId `json:"id" bson:"_id,omitempty"`
		Rank 			int        	  `json:"rank" bson:"rank"`
		Email    		string        `json:"email" bson:"email"`
		Point    		int        	  `json:"point" bson:"point"`
		Tried 			int           `json:"tried" bson:"tried"`
		FinishedTime 	string        `json:"finished_time" bson:"finished_time"`
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
