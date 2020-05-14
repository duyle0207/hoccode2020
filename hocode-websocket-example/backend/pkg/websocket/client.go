package websocket

import (
	"encoding/json"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	//"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   	string
	Conn 	*websocket.Conn
	Pool 	*Pool
}

type (
	Message struct {
		Type int    `json:"type"`
		Body string `json:"body"`
	}
)

type (
	Dev struct {
		Id 		bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
		Name 	string `json:"name,omitempty" bson:"name,omitempty"`
		Salary 	int `json:"salary,omitempty" bson:"salary,omitempty"`
		Time 	int `json:"time,omitempty" bson:"time,omitempty"`
		Conn 	*websocket.Conn
		Pool 	*Pool
	}
)

func (d *Dev) Read() {
	defer fmt.Println("[READ]")

	defer func() {
		d.Pool.UnJoin <- d
		d.Conn.Close()
	}()

	for {
		messageType, p, err := d.Conn.ReadMessage()

		var message1 Message

		errJson := json.Unmarshal([]byte(p), &message1)

		fmt.Println(errJson)

		fmt.Println("[Body]")
		fmt.Println(message1.Body)

		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Body: string(p)}

		user_message := UserMessage{
			IsUpdatePoint: true,
			UserStatus:    string(p),
			LeaderBoard:   nil,
		}

		db, _ := mgo.Dial("localhost:27017/test")

		dev := &Dev{}

		_ = db.DB("test").C("dev").Find(bson.M{
			"_id" : bson.ObjectIdHex(message.Body),
		}).One(&dev)

		dev.Salary = dev.Salary - 10
		dev.Salary = dev.Salary - 20

		_, _ = db.DB("test").C("dev").UpsertId(dev.Id, dev)

		d.Pool.IsUpdatePoint <- user_message

		fmt.Printf("Message Received: %+v\n", message)
	}
}