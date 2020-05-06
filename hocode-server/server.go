package main

import (
	"crypto/tls"
	"net"
	"time"

	"github.com/duyle0207/hoccode2020/config"
	"github.com/duyle0207/hoccode2020/handler"
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	"gopkg.in/mgo.v2"
)

// @title Hocode API
// @version 1.0
// @description This is a server Api Hocode.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host hocodevn.com
// @BasePath /api/v1

func main() {

	sentry.Init(sentry.ClientOptions{
		Dsn: "https://dc72a0f7e03b48ee9f92721698fbd011@sentry.io/1827288",
	})

	//sentry.CaptureException(errors.New("Start App"))
	// Since sentry emits events in the background we need to make sure
	// they are sent before we shut down
	//sentry.Flush(time.Second * 5)

	e := echo.New()
	// e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
		Level: 5,
	}))

	// Root level middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// mongodb://admin:adminadmin1@ds021984.mlab.com:21984/hocode
	//_, err := mgo.Dial("mongodb://admin:adminadmin1@ds021984.mlab.com:21984/hocode")

	//db, err := mgo.Dial(config.LinkDb + config.NameDb)
	//if err != nil {
	//	log.Info("Connect mongodb error")
	//	e.Logger.Fatal(err)
	//} else {
	//	log.Info("Connect mongodb success")
	//}

	//URI without ssl=true
	//var mongoURI = "mongodb://duyle:aaaaaaaa@" +
	//	"cluster0-shard-00-01-gwhbh.mongodb.net:27017" +
	//	",cluster0-shard-00-00-gwhbh.mongodb.net:27017.mongodb.net," +
	//	"cluster0-shard-00-02-gwhbh.mongodb.net:27017.mongodb.net/hocode?replicaSet=replName&authSource=admin"
	//
	//dialInfo, err := mgo.ParseURL(mongoURI)
	//
	////Below part is similar to above.
	//tlsConfig := &tls.Config{}
	//dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
	//	conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
	//	return conn, err
	//}
	//db, err := mgo.DialWithInfo(dialInfo)
	//
	//if err != nil {
	//	log.Info("Connect mongodb error")
	//	e.Logger.Fatal(err)
	//} else {
	//	log.Info("Connect mongodb success")
	//}

	// Connect mongo cluster
	tlsConfig := &tls.Config{}

	dialInfo := &mgo.DialInfo{
		Addrs:    []string{config.LinkDb, config.LinkDb2, config.LinkDb3},
		Database: config.NameDb,
		Username: config.Username,
		Password: config.Password,
		Timeout:  60 * time.Second,
		Source:   config.Source,
	}
	dialInfo.DialServer = func(addr *mgo.ServerAddr) (net.Conn, error) {
		conn, err := tls.Dial("tcp", addr.String(), tlsConfig)
		return conn, err
	}
	db, err := mgo.DialWithInfo(dialInfo)

	if err != nil {
		log.Info("Connect mongodb error")
		e.Logger.Fatal(err)
	} else {
		log.Info("Connect mongodb success")
	}

	//Connect Mongo local
	//db, err := mgo.Dial("localhost:27017/hocode")
	//if err != nil {
	//	log.Info("Connect mongodb error")
	//	e.Logger.Fatal(err)
	//} else {
	//	log.Info("Connect mongodb success")
	//}

	// Initialize handler
	h := &handler.Handler{DB: db}

	e.GET("/health_check", h.HealthCheck)
	e.GET("/health_check2", h.HealthCheck)

	e.POST("/createTaskMinTask", h.CreateTaskMinTask)

	e.GET("/users", h.GetUser)
	// e.GET("/users/:id", h.GetUserByID)
	// e.POST("/users", h.SaveUser)
	// e.PUT("/users/:id", h.UpdateUser)
	// e.DELETE("/users/:id", h.DeleteUser)

	// e.GET("/show", h.Show)

	// e.GET("/courses", h.Courses)
	// e.GET("/courses/:id", h.CourseByID)
	// e.GET("/courses/:id/tasks", h.TaskByCoursesID)
	// e.POST("/courses", h.CreateCourse)

	// e.GET("/tasks", h.Task)
	// e.GET("/tasks/:id", h.TaskByID)
	// e.POST("/tasks", h.CreateTask)

	// e.GET("/minitasks", h.Minitasks)
	// e.GET("/minitasks/:id", h.MinitasksByID)
	// e.POST("/minitasks", h.CreateMinitast)

	// e.GET("/profile", h.Profile)
	// e.POST("/profile", h.CreateProfile)

	r := e.Group("/api/v1")

	r.GET("/courses", h.Courses)
	r.GET("/totalCourse", h.GetTotalCourse)
	r.GET("/getNewestCourse", h.GetNewestCourse)
	r.GET("/courses/:id", h.CourseByID)
	r.GET("/courses/:id/tasks", h.TaskByCoursesID)

	r.GET("/tasks", h.Task)
	r.GET("/tasks/:id", h.TaskByID)

	r.GET("/minitasks", h.Minitasks)
	r.GET("/getAllMinitask/:page", h.GetAllMinitask)
	r.GET("/getTotalMinitask", h.GetTotalMinitask)
	r.GET("/minitasks/:id", h.MinitasksByID)

	r.GET("/profile", h.Profile)
	r.POST("/profile", h.CreateProfile)
	r.POST("/login", h.Login)
	r.POST("/signup", h.SignUp)
	r.POST("/isNewAccount", h.IsNewAccount)

	r.GET("/dailyminitask", h.DailyMiniTask)

	r.GET("/books", h.GetBooks)
	r.GET("/events", h.GetListEvents)

	r.GET("/daily", h.DailyMiniTask)

	r.GET("/getMinitasksByTaskID/:id", h.GetMiniTaskByTaskID)
	r.GET("/totalMinitask/:course_id", h.GetTotalCourseMinitask)

	r.GET("/certs/search/:id", h.SearchCertsByID)

	r.GET("/getGeneralLeaderBoard", h.GetGeneralLeaderBoard)

	// send email
	r.POST("/sendmail", h.SendEmail)
	r.POST("/createCourseType", h.CreateCourseType)
	r.GET("/getCourseTypeList", h.GetCourseTypeList)
	r.GET("/getCourseByCourseType/:course_type", h.GetCourseByCourseType)
	r.GET("/searchCourseByCourseType/:course_type/:keyword/", h.SearchCourseByCourseType)

	curd := e.Group("/api/v1/curd")

	curd.Use(middleware.JWT([]byte("secret")))

	curd.GET("/get3RandomMinitask", h.Get3RandomMinitask)
	curd.GET("/searchUser/:email", h.SearchUser)

	// CURD
	curd.GET("/getAllMinitask/:page", h.GetAllMinitask)
	curd.GET("/getTotalMinitask", h.GetTotalMinitask)
	curd.POST("/runPracticeCode", h.RunCodePractice)
	curd.GET("/getUserMinitaskPractice/:minitask_id", h.GetUserPracticeCode)
	curd.GET("/getUserMinitaskPractice", h.GetUserPracticeMinitask)

	curd.GET("/getChartInfo", h.GetChartInfo)

	curd.GET("/configs", h.GetListConfigs)
	curd.GET("/configs/byname/:id", h.GetConfigByName)
	curd.GET("/configs/:id", h.GetOneConfigs)
	curd.PUT("/configs/:id", h.UpdateConfigs)
	curd.POST("/configs", h.CreateConfigs)
	curd.DELETE("/configs/:id", h.DeleteConfigs)

	curd.GET("/certs", h.GetListCerts)
	curd.GET("/certs/:id", h.GetOneCerts)
	curd.PUT("/certs/:id", h.UpdateCerts)
	curd.POST("/certs", h.CreateCerts)
	curd.DELETE("/certs/:id", h.DeleteCerts)

	curd.GET("/books", h.GetListBooks)
	curd.GET("/books/:id", h.GetOneBooks)
	curd.PUT("/books/:id", h.UpdateBooks)
	curd.POST("/books", h.CreateBooks)
	curd.DELETE("/books/:id", h.DeleteBooks)

	curd.GET("/users", h.GetListUsers)
	curd.GET("/users/:id", h.GetOneUsers)
	curd.PUT("/users/:id", h.UpdateUsers)
	curd.POST("/users", h.CreateUsers)
	curd.DELETE("/users/:id", h.DeleteUsers)

	curd.GET("/events", h.GetListEvents)
	curd.GET("/events/:id", h.GetOneEvents)
	curd.PUT("/events/:id", h.UpdateEvents)
	curd.POST("/events", h.CreateEvents)
	curd.DELETE("/events/:id", h.DeleteEvents)

	curd.GET("/courses", h.GetListCourses)
	curd.GET("/courses/:id", h.GetOneCourses)
	curd.PUT("/courses/:id", h.UpdateCourses)
	curd.POST("/courses", h.CreateCourses)
	curd.DELETE("/courses/:id", h.DeleteCourses)

	curd.GET("/tasks", h.GetListTasks)
	curd.GET("/tasks/:id", h.GetOneTasks)
	curd.PUT("/tasks/:id", h.UpdateTasks)
	curd.POST("/tasks", h.CreateTasks)
	curd.DELETE("/tasks/:id", h.DeleteTasks)

	curd.GET("/searchMinitasks/:mini_task_name/", h.SearchMinitasks)
	curd.GET("/searchMinitasksPracticePage/:mini_task_name/:status/:level/", h.SearchMinitasksPracticePage)
	curd.GET("/minitasks", h.GetListMiniTasks)
	curd.GET("/minitasks/:id", h.GetOneMiniTasks)
	curd.PUT("/minitasks/:id", h.UpdateMiniTasks)
	curd.POST("/minitasks", h.CreateMiniTasks)
	curd.DELETE("/minitasks/:id", h.DeleteMiniTasks)
	curd.DELETE("/task_minitask/:task_id/:minitask_id/:course_id", h.DeleteTaskMinitask)
	curd.GET("/getCoursePassInfo/:course_id", h.IsPassTask)

	curd.GET("/getUserMinitaskFavourite/:minitask_id", h.CheckUserLikeMinitask)
	curd.GET("/handleLikeMinitask/:minitask_id", h.AddMinitaskToFavouriteList)
	curd.GET("/getUserMinitaskFavouriteList", h.GetUserMinitaskFavourite)

	//API for curd fight page
	curd.GET("/fights", h.GetListFight)
	curd.GET("/fights/:id", h.GetOneFight)
	curd.POST("/fights", h.CreateFights)
	curd.DELETE("/fights/:id", h.DeleteFights)
	curd.PUT("/fights/:id", h.UpdateFights)

	// API for curd fight minitask
	curd.POST("/fightminitask", h.CreateFightMinitask)
	curd.GET("/fightminitask", h.GetListFightMinitask)
	curd.GET("/fightminitask/:id", h.GetOneFightMinitask)
	curd.GET("/listminitaskfight/:fightid", h.GetListMinitaskByFightID)
	curd.DELETE("/delminitask/:fight_id/:minitask_id", h.DeleteFightMinitask)

	// End CURD

	rs := e.Group("/api/v1/auth")

	rs.GET("/events", h.GetListEvents)
	rs.GET("/events/:id", h.GetOneEvents)
	rs.PUT("/events/:id", h.UpdateEvents)
	rs.POST("/events", h.CreateEvents)
	rs.DELETE("/events/:id", h.DeleteEvents)

	r.POST("/createevent", h.CreateEvents)
	r.POST("/createbook", h.CreateBook)
	r.POST("/courses", h.CreateCourse)
	r.POST("/tasks", h.CreateTask)

	r.GET("/listMinitask", h.GetListUserMinitask)

	r.POST("/minitasks", h.CreateMinitast)

	rs.Use(middleware.JWT([]byte("secret")))
	rs.GET("", h.TestAuth)

	rs.GET("/getCourseLeaderBoard/:course_id", h.GetCourseLeaderBoard)

	rs.GET("/reviewcert", h.ReviewCert)
	rs.GET("/viewcert", h.ViewCertUser)

	rs.GET("/userinfo", h.GetUserData)
	rs.POST("/userinfoupdate", h.UpdataUserData)

	rs.GET("/listUserCourse", h.GetListUserCourse)

	rs.GET("/usercourse", h.GetUserCourse)
	rs.GET("/usercourseProfile", h.GetUserCourseProfile)
	rs.GET("/completeminitask", h.GetUserCompleteMititask)

	rs.GET("/courses/:id/tasks", h.AuthTaskByCoursesID)

	rs.POST("/updateusercourse/:course_id", h.UpdateUserCourse)

	rs.POST("/nextminitask", h.NextMiniTask)

	rs.POST("/nextminitask", h.NextMiniTask)

	rs.GET("/tasks/:id", h.TaskByID)

	// API for  fight user minitask
	rs.POST("/runfightminitask", h.CreateFightUserMinitask)
	rs.PUT("/updatefightuserminitask/:id", h.UpdateFightUserMinitask)

	ra := e.Group("/auth")
	ra.Use(middleware.JWT([]byte("secret")))
	ra.GET("", h.TestAuth)
	ra.GET("/userinfo", h.GetUserData)
	ra.POST("/userinfoupdate", h.UpdataUserData)

	ra.GET("/usercourse", h.GetUserCourse)

	ra.GET("/completeminitask", h.GetUserCompleteMititask)

	ra.POST("/updateusercourse", h.UpdateUserCourse)

	ra.POST("/nextminitask", h.NextMiniTask)

	ra.POST("/nextminitask", h.NextMiniTask)
	ra.GET("/tasks/:id", h.TaskByID)

	ra.GET("/viewcert", h.ViewCertUser)

	// e.Use(middleware.Static("/static"))
	// e.Static("/", "static")
	// e.GET("/", h.Gethome)
	// e.Static("/*", "../hocode-web/build")
	// e.File("/*", "../hocode-web/build/index.html")
	// e.GET("/swagger/*", echoSwagger.WrapHandler)

	// r.GET("/rungolang", h.RunGolang)
	r.POST("/rungolang", h.RunGolang)

	e.File("/swagger.yaml", "docs/swagger.yaml")

	e.File("/docs", "static/docs.html")

	e.File("/docs2", "static/dist/index.html")
	e.File("/swagger-ui.css", "static/dist/swagger-ui.css")
	e.File("/swagger-ui-bundle.js", "static/dist/swagger-ui-bundle.js")
	e.File("/swagger-ui-standalone-preset.js", "static/dist/swagger-ui-standalone-preset.js")

	// e.File("*", "static/index.html")

	// e.Static("/", "web/")
	e.Use(middleware.Static("/web"))
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root: "web",
		// Browse: true,
		Index: "index.html",
	}))

	e.File("/", "web/index.html")
	e.File("*", "web/index.html")

	e.Use(ServerHeader)
	e.Logger.Fatal(e.Start(":8081"))
}

func ServerHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set(echo.HeaderServer, "Echo/3.0")
		c.Response().Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Response().Header().Set("Access-Control-Expose-Headers", "Content-Range")
		c.Response().Header().Set("Access-Control-Expose-Headers", "X-Total-Count")

		// c.Response().Header().Set("Content-Range", "bytes : 0-9/*")
		return next(c)
	}
}
