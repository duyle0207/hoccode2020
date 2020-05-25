package model

import (
	"encoding/json"
	"fmt"
	"github.com/duyle0207/hoccode2020/config"
	"github.com/gorilla/websocket"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

type (
	Pool struct {
		GetIn   			chan *UserFightWebSocket
		GetOut 				chan *UserFightWebSocket
		UserWebsocket	   	map[*UserFightWebSocket]bool
		IsGetFight			chan FightSocketRequest
		IsJoinFight  		chan FightSocketRequest
		IsSubmitSuccessful  chan FightSocketRequest
		IsSubmitFailed  	chan FightSocketRequest
	}
)

func NewPool() *Pool {
	return &Pool{
		GetIn:   			make(chan *UserFightWebSocket),
		GetOut: 			make(chan *UserFightWebSocket),
		UserWebsocket:      make(map[*UserFightWebSocket]bool),
		IsGetFight:			make(chan FightSocketRequest),
		IsJoinFight:  		make(chan FightSocketRequest),
		IsSubmitSuccessful: make(chan FightSocketRequest),
		IsSubmitFailed:  	make(chan FightSocketRequest),
	}
}

type (
	UserFightWebSocket struct {
		UserID		string 		`json:"user_id" bson:"user_id"`
		Conn 		*websocket.Conn
		Pool 		*Pool
	}
)

type (
	Message struct {
		Type	string 		`json:"type" bson:"type"`
		Body	string 		`json:"body" bson:"body"`
		FightID	string		`json:"fight_id" bson:"fight_id"`
	}
)

type (
	FightSocketRequest struct {
		FightID			string 		`json:"fight_id" bson:"fight_id"`
		UserID			string 		`json:"user_id" bson:"user_id"`
		Minitask_ID		string 		`json:"minitask_id" bson:"minitask_id"`
		Point			int			`json:"point" bson:"point"`
		Request			string 		`json:"request" bson:"request"`
	}
)

type (
	UserMessage struct {
		Message			string				`json:"message" bson:"message"`
		CurrentUsers	int					`json:"current_users" bson:"current_users"`
		LeaderBoard		[]*FightUserRank	`json:"leader_board" bson:"leader_board"`
	}
)

func ConnectDB() *mgo.Session{
	//
	//tlsConfig := &tls.Config{}
	//
	//// Connect Database
	//dialInfo := &mgo.DialInfo{
	//	Addrs:    []string{config.LinkDb, config.LinkDb2, config.LinkDb3},
	//	Database: config.NameDb,
	//	Username: config.Username,
	//	Password: config.Password,
	//	Timeout:  60 * time.Second,
	//	Source:   config.Source,
	//}
	//dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
	//	conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
	//	return conn, err
	//}
	//
	//db, _ := mgo.DialWithInfo(dialInfo)

	db, _ := mgo.Dial("localhost:27017/hocode")

	return db
}

func (userFightWebSocket *UserFightWebSocket) HandleRequest() {
	defer fmt.Println("[READ]")

	defer func() {
		userFightWebSocket.Pool.GetOut <- userFightWebSocket
		_ = userFightWebSocket.Conn.Close()
	}()

	for {
		// handle object from react here
		_, p, err := userFightWebSocket.Conn.ReadMessage()

		if err != nil {
			log.Println(err)
			return
		}

		var request FightSocketRequest

		errJson := json.Unmarshal([]byte(p), &request)

		fmt.Println(errJson)

		fmt.Println("[Body]")
		fmt.Println(request.FightID)

		if request.Request == "get-leader-board" {
			fmt.Println("[GET LEADER BOARD]")
			userFightWebSocket.Pool.IsGetFight <- request
		}

		message := Message{Type: "Message", Body: string(p)}

		fmt.Printf("Message Received: %+v\n", message)
	}

}

func (pool *Pool) Start() {
	db := ConnectDB()
	for {
		select {
		case userWebsocket := <- pool.GetIn:
			pool.UserWebsocket[userWebsocket] = true
			for user, _ :=range pool.UserWebsocket {

				// Return LeaderBoard0
				m := []*FightUserRank{}

				user.Conn.WriteJSON(UserMessage{
					Message: "One Get In",
					CurrentUsers: len(pool.UserWebsocket),
					LeaderBoard: m,
				})
			}
			break
		case userWebsocket := <- pool.GetOut:
			delete(pool.UserWebsocket, userWebsocket)
			for user, _ :=range pool.UserWebsocket {
				m := []*FightUserRank{}
				user.Conn.WriteJSON(UserMessage{
					Message: "One Get Out",
					CurrentUsers: len(pool.UserWebsocket),
					LeaderBoard: m,
				})
			}
			break
		case userSocket := <- pool.IsGetFight:
			for user, _ :=range pool.UserWebsocket {
				start := time.Now()
				fmt.Println("Get List ABC")
				// Return LeaderBoard
				m := []*FightUserRank{}
				m = GetLeaderBoard(userSocket.FightID, db)
				//fmt.Println(len(m))

				elapsed := time.Since(start)
				log.Printf("FUNC TOOKS %s", elapsed)

				user.Conn.WriteJSON(UserMessage{
					Message: "get-leader-board",
					CurrentUsers: len(pool.UserWebsocket),
					LeaderBoard: m,
				})
			}
			break
		}
	}
}

func GetLeaderBoard(fight_id string, db *mgo.Session) []*FightUserRank {

	// Get Fight User List
	fight_user := []*FightUser{}

	fmt.Println(fight_id)

	_ = db.DB(config.NameDb).C("fight_user").Find(bson.M{"fight_id": fight_id}).Sort("-point").All(&fight_user)

	result := []*FightUserRank{}

	fight_minitasks := []*FightMiniTask{}
	_ =  db.DB(config.NameDb).C("fight_minitask").Find(bson.M{
		"fight_id": fight_id,
	}).All(&fight_minitasks)

	for i:= range fight_user {
		// Get User Info
		user_info := User{}
		_ = db.DB(config.NameDb).C("users").Find(bson.M{
			"_id": bson.ObjectIdHex(fight_user[i].UserID),
		}).One(&user_info)

		// Fight User Mini task
		fight_user_minitasks := []*FightUserMinitask{}
		_ =  db.DB(config.NameDb).C("fight_user_minitask").Find(bson.M{
			"fight_id": fight_id,
			"user_id": fight_user[i].UserID,
		}).All(&fight_user_minitasks)

		minitasks := []*FightUserMinitask{}
		total_tried := 0
		for j:=range fight_minitasks {
			isFound := false
			minitask := &FightUserMinitask{}
			for a:=range fight_user_minitasks {
				if fight_minitasks[j].Minitask_id == fight_user_minitasks[a].Minitask_id {
					isFound = true
					minitask = fight_user_minitasks[a]
					minitask.Point = GetMinitaskPoint(fight_minitasks[j].Minitask_id, db)
					total_tried += fight_user_minitasks[a].Tried
				}
			}
			if !isFound {
				minitask = &FightUserMinitask{
					ID:          "",
					Fight_id:    fight_id,
					User_id:     fight_user[i].UserID,
					Minitask_id: "",
					Status:      "tried",
					Tried:       0,
					Point:		GetMinitaskPoint(fight_minitasks[j].Minitask_id, db),
					Start_time:  "",
					End_time:    "",
				}
			}
			minitasks = append(minitasks, minitask)
		}

		var coding_time int64 = -1
		if fight_user[i].IsUserStart {
			coding_time = time.Since(fight_user[i].StartTime).Milliseconds()
		}

		user_rank := &FightUserRank{
			ID:           "",
			Rank:         i,
			Email:        user_info.Email,
			UserInfo:     user_info,
			MiniTasks:    minitasks,
			Point:        fight_user[i].Point,
			Tried:        total_tried,
			CodingTime:	  coding_time,
			FinishedTime: fight_user[i].FinishedTime,
		}

		result = append(result, user_rank)
	}

	return result
}


func GetMinitaskPoint(id string, db *mgo.Session) int {

	minitask := MiniTask{}

	_ = db.DB(config.NameDb).C("minitasks").Find(bson.M{
		"_id": bson.ObjectIdHex(id),
	}).One(&minitask)

	return minitask.CodePoint
}