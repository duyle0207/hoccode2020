package model

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
)

type (
	Pool struct {
		GetIn   			chan *UserFightWebSocket
		GetOut 				chan *UserFightWebSocket
		UserWebsocket	   	map[*UserFightWebSocket]bool
		IsJoinFight  		chan Message
		IsSubmitSuccessful  chan Message
		IsSubmitFailed  	chan Message
	}
)

func NewPool() *Pool {
	return &Pool{
		GetIn:   			make(chan *UserFightWebSocket),
		GetOut: 			make(chan *UserFightWebSocket),
		UserWebsocket:      make(map[*UserFightWebSocket]bool),
		IsJoinFight:  		make(chan Message),
		IsSubmitSuccessful: make(chan Message),
		IsSubmitFailed:  	make(chan Message),
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

		message := Message{Type: "Message", Body: string(p)}

		fmt.Printf("Message Received: %+v\n", message)
	}

}

func (pool *Pool) Start() {
	for {
		select {
		case userWebsocket := <- pool.GetIn:
			pool.UserWebsocket[userWebsocket] = true
			for user, _ :=range pool.UserWebsocket {
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
		}
	}
}
