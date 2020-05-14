package websocket

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Pool struct {
	Join   			chan *Dev
	UnJoin 			chan *Dev
	Devs	   		map[*Dev]bool
	IsUpdatePoint  	chan UserMessage
}

type UserMessage struct {
	IsUpdatePoint 		bool    `json:"is_update_point"`
	UserStatus			string	`json:"user_status"`
	LeaderBoard			[]*Dev	`json:"leader_board"`
}

func NewPool() *Pool {
	return &Pool{
		Join:   			make(chan *Dev),
		UnJoin: 			make(chan *Dev),
		Devs:       		make(map[*Dev]bool),
		IsUpdatePoint:  	make(chan UserMessage),
	}
}

func (pool *Pool) Start() {

	//list := []*Message{}
	//
	//for i:=0;i<3;i++{
	//	item := &Message{
	//		Type: i,
	//		Body: "item",
	//	}
	//
	//	list = append(list, item)
	//}
	defer fmt.Println("[POOL]")

	for {
		select {
		case dev := <-pool.Join:
			pool.Devs[dev] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Devs))

			db, _ := mgo.Dial("localhost:27017/test")

			devs := []*Dev{}

			_ = db.DB("test").C("dev").Find(bson.M{}).Sort("-salary").All(&devs)

			SortDevs(devs)

			for dev, _ := range pool.Devs {
				_ = dev.Conn.WriteJSON(UserMessage{
					IsUpdatePoint: true,
					UserStatus:    "in",
					LeaderBoard:   devs,
				})
			}
			break
		case dev := <-pool.UnJoin:
			delete(pool.Devs, dev)
			fmt.Println("Size of Connection Pool: ", len(pool.Devs))

			db, _ := mgo.Dial("localhost:27017/test")

			devs := []*Dev{}

			_ = db.DB("test").C("dev").Find(bson.M{}).Sort("-salary").All(&devs)

			for client, _ := range pool.Devs {
				_ = client.Conn.WriteJSON(UserMessage{
					IsUpdatePoint: true,
					UserStatus:    "out",
					LeaderBoard:   []*Dev{},
				})
			}
			break
		case message := <-pool.IsUpdatePoint:
			fmt.Println("Sending message to all clients in Pool")

			db, _ := mgo.Dial("localhost:27017/test")

			devs := []*Dev{}

			_ = db.DB("test").C("dev").Find(bson.M{}).Sort("-salary").All(&devs)

			SortDevs(devs)

			for client, _ := range pool.Devs {
				client.Conn.WriteJSON(UserMessage{
					IsUpdatePoint: true,
					UserStatus:    message.UserStatus,
					LeaderBoard:   devs,
				})
			}
		}
	}
}

func SortDevs(devs []*Dev) {
	i := 0
	for i < len(devs)-1 {
		start := -1
		end := 0
		if devs[i].Salary == devs[i+1].Salary {
			start = i
			for j:=start+1;j<len(devs)-1&&devs[j].Salary==devs[j+1].Salary;j++{
				end++
			}
			if end!=0 {
				i = end
			}
		}
		if start!=-1 && end!=0 {
			fmt.Println("==")
			fmt.Println(start)
			fmt.Println(end)
			fmt.Println("==")
			for x:= start;x<=end+1;x++{
				for y:=start;y<end+1-x;y++ {
					if devs[y].Time < devs[y+1].Time {
						devs[y], devs[y+1] = devs[y+1], devs[y]
					}
				}
			}
			fmt.Println(i)
		}
		i++
	}
}
