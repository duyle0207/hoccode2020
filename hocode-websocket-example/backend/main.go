package main

import (
	"fmt"
	"github.com/labstack/gommon/log"
	"github.com/labstack/echo/middleware"
	"net/http"

	//"net/http"
	"github.com/labstack/echo"
	"github.com/TutorialEdge/realtime-chat-go-react/pkg/websocket"
	"gopkg.in/mgo.v2"

	//
	w "github.com/gorilla/websocket"
)

//func serveWs(pool *websocket.Pool, ctx echo.Context) {
//
//	fmt.Println("WebSocket Endpoint Hit")
//
//	conn, err := websocket.Upgrade(ctx.Response(), ctx.Request())
//
//	if err != nil {
//		fmt.Fprintf(ctx.Response(), "%+v\n", err)
//	}
//
//	client := &websocket.Client{
//		ID: "id",
//		Conn: conn,
//		Pool: pool,
//	}
//
//	pool.Register <- client
//	client.Read()
//}

//func setupRoutes(ctx echo.Context) {
//	pool := websocket.NewPool()
//	go pool.Start()
//
//	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
//		serveWs(pool, ctx)
//	})
//}

func main() {
	fmt.Println("Distributed Chat App v0.01")

	e := echo.New()
	e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))

	// Root level middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://labstack.com", "https://labstack.net"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	_, err := mgo.Dial("localhost:27017/test")
	if err != nil {
		log.Info("Connect mongodb error")
		e.Logger.Fatal(err)
	}

	pool := websocket.NewPool()
	go pool.Start()

	var rLimit syscall.Rlimit
	err := syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit)
	if err != nil {
		fmt.Println("Error Getting Rlimit ", err)
	}
	fmt.Println(rLimit)
	rLimit.Max = 999999
	rLimit.Cur = 999999
	err = syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit)
	if err != nil {
		fmt.Println("Error Setting Rlimit ", err)
	}
	err = syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit)
	if err != nil {
		fmt.Println("Error Getting Rlimit ", err)
	}
	fmt.Println("Rlimit Final", rLimit)

	e.GET("/testSocket", func(context echo.Context) (e error) {

		url := "ws://localhost:8080/ws"
		n := 5000
		//total_Conn := 0

		for i:=0;i<n;i++{
			_, _, err := w.DefaultDialer.Dial(url, nil)
			if err != nil {
				fmt.Println(err)
			} else {
				//total_Conn++
				//fmt.Println("Total number of connection: ", total_Conn)
			}
		}

		return e
	})

	e.GET("/ws", func(ctx echo.Context) error{
		fmt.Println("WebSocket Endpoint Hit")

		conn, err := websocket.Upgrade(ctx.Response(), ctx.Request())

		if err != nil {
			fmt.Fprintf(ctx.Response(), "%+v\n", err)
		}

		dev := &websocket.Dev{
			Id:     "id",
			Name:   "",
			Salary: 0,
			Conn:   conn,
			Pool:   pool,
		}

		pool.Join <- dev

		//dev.Read()

		return err
	})

	e.Use(ServerHeader)
	e.Logger.Fatal(e.Start(":8080"))
}

func ServerHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(context echo.Context) error {
		context.Response().Header().Set(echo.HeaderServer, "Echo/3.0")
		context.Response().Header().Set("Access-Control-Expose-Headers", "Content-Range")
		context.Response().Header().Set("Access-Control-Expose-Headers", "X-Total-Count")
		//context.Response().Header().Set("Access-Control-Allow-Origin:", "*")

		return next(context)
	}
}
