package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/duyle0207/hoccode2020/config"

	"github.com/dgrijalva/jwt-go"
	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// var p = model.Course{
// 	ID:         bson.NewObjectId(),
// 	CourseName: "Certificate",
// 	TaskSolved: model.TaskSolved{
// 		TaskCount:     60,
// 		TasksComplete: 5,
// 	},
// 	BackgroundImage: "https://loremflickr.com/500/500",
// }

// http://localhost:8080/courses?page=1&limit=5

// Courses godoc
// @Summary List Courses
// @ID course_list
// @Description get courses <a href="/api/v1/courses?page=1&limit=5">/api/v1/courses?page=1&limit=5</a>
// @Tags Courses
// @Accept  json
// @Produce  json
// @Success 200 {array} model.Course
// @Router /courses [get]
func (h *Handler) Courses(c echo.Context) (err error) {

	courses := []*model.Course{}
	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("course").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&courses); err != nil {
		return
	}

	for i := 0; i < len(courses); i++ {
		mta := []*model.Task{}

		db.DB(config.NameDb).C("tasks").
			Find(bson.M{
				"course_id": courses[i].ID.Hex(),
				"del":       bson.M{"$ne": true}},
			).
			Select(bson.M{"_id": 1, "task_name": 1}).
			Sort("-timestamp").
			All(&mta)
		courses[i].Tasks = mta

	}

	c.Response().Header().Set("x-total-count", strconv.Itoa(len(courses)))

	return c.JSON(http.StatusOK, courses)
}

func (h *Handler) GetTotalCourse(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	total_course, _ := db.DB(config.NameDb).C("course").Find(bson.M{
		"status": "Active",
	}).Count()

	return c.JSON(http.StatusOK, total_course)
}

func (h *Handler) GetNewestCourse(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	courses := []*model.Course{}

	_ = db.DB(config.NameDb).C("course").Find(bson.M{
		"status": "Active",
	}).Skip(0).Limit(4).Sort("-timestamp").All(&courses)

	return c.JSON(http.StatusOK, courses)
}

func (h *Handler) CreateCourseType(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	course_type := &model.CourseType{}

	if err = c.Bind(course_type); err!=nil{
		return c.JSON(http.StatusOK, err)
	}

	course_type.ID = bson.NewObjectId()

	_, err = db.DB(config.NameDb).C("course_type").UpsertId(course_type.ID, course_type)

	if err != nil {
		return c.JSON(http.StatusOK, err)
	}

	return c.JSON(http.StatusOK, "success")
}

func (h *Handler) GetCourseTypeList(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	course_type := []*model.CourseType{}

	db.DB(config.NameDb).C("course_type").Find(bson.M{}).All(&course_type)

	return c.JSON(http.StatusOK, course_type)
}

func (h *Handler) GetCourseByCourseType(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	course_type := c.Param("course_type")

	courses := []*model.Course{}

	db.DB(config.NameDb).C("course").Find(bson.M{
		"course_type": course_type,
		"status": "Active",
	}).All(&courses)

	return c.JSON(http.StatusOK, courses)
}

func (h *Handler) SearchCourseByCourseType(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	course_type := c.Param("course_type")
	keyword := c.Param("keyword")

	courses := []*model.Course{}

	db.DB(config.NameDb).C("course").Find(bson.M{
		"course_type": course_type,
		"status": "Active",
		"course_name": bson.RegEx{keyword, "i"},
	}).All(&courses)

	return c.JSON(http.StatusOK, courses)
}

// http://localhost:8080/courses/5d86e07bfe6e2b157bd3b259

// CourseByID godoc
// @Summary Get Course By ID
// @Description get courses by ID <a href="/courses/5d86e07bfe6e2b157bd3b259">/courses/5d86e07bfe6e2b157bd3b259</a>
// @Tags Courses
// @Accept  json
// @Produce  json
// @Param  id path int true "Course ID"
// @Success 200 {object} model.Course
// @Router /courses/{id} [get]
func (h *Handler) CourseByID(c echo.Context) (err error) {
	course := &model.Course{}

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("course").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(id),
			"del": bson.M{"$ne": true},
		}).
		One(&course); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}

		return
	}

	return c.JSON(http.StatusOK, course)
}

// http://localhost:8080/courses/5d86e07bfe6e2b157bd3b259/tasks

// TaskByCoursesID godoc
// @Summary Get Task By Courses ID
// @Description Get Task By Courses ID <a href="/api/v1/courses/5d86e07bfe6e2b157bd3b259/tasks">/api/v1/courses/5d86e07bfe6e2b157bd3b259/tasks</a>
// @Tags Courses
// @Accept  json
// @Produce  json
// @Param  id path int true "Course ID"
// @Success 200 {array} model.Task
// @Router /courses/{id}/tasks [get]
func (h *Handler) TaskByCoursesID(c echo.Context) (err error) {
	ta := []*model.Task{}

	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	// user := c.Get("user").(*jwt.Token)
	// claims := user.Claims.(jwt.MapClaims)
	// userID := claims["id"].(string)

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("tasks").
		Find(bson.M{"course_id": id, "del": bson.M{"$ne": true}}).
		Skip((page - 1) * limit).
		Limit(limit).
		Sort("-timestamp").
		All(&ta); err != nil {
		return
	}

	for i := 0; i < len(ta); i++ {
		mta := []*model.MiniTask{}

		db.DB(config.NameDb).C("minitasks").
			Find(bson.M{
				"task_id": ta[i].ID.Hex(),
				"del":     bson.M{"$ne": true}},
			).
			Sort("-timestamp").
			All(&mta)

		// userMiniTask := &model.UserMiniTask{}

		// if err = db.DB(config.NameDb).C("user_minitask").
		// 	Find(bson.M{
		// 		"user_id": userID,
		// 		"del":     bson.M{"$ne": true},
		// 	}).
		// 	One(&userMiniTask); err != nil {
		// 	// if err == mgo.ErrNotFound {
		// 	// 	uc.CourseInfo = []CourseInfo
		// 	// }
		// 	// isInDBUserMiniTask = false
		// 	// return
		// }
		// vitri := -1

		// for i := 0; i < len(mta); i++ {
		// 	for j := 0; j < len(
		// 		userMiniTask.MiniTaskInfo); j++ {
		// 		if mta[i].ID.Hex() == userMiniTask.MiniTaskInfo[j].MiniTaskID {
		// 			vitri = i
		// 			mta[i].Status = userMiniTask.MiniTaskInfo[j].Status
		// 		}

		// 	}

		// }

		// if vitri != -1 {
		// 	mta[vitri].Vitri = true
		// }

		ta[i].Minitasks = mta

	}

	return c.JSON(http.StatusOK, ta)
}

// Task godoc
// @Summary Get Task By Courses ID Auth
// @Description Get Task By Courses ID <a href="/api/v1/courses/5d86e07bfe6e2b157bd3b259/tasks">/api/v1/courses/5d86e07bfe6e2b157bd3b259/tasks</a>
// @Tags Courses
// @Accept  json
// @Produce  json
// @Param  id path int true "Course ID"
// @Success 200 {array} model.Task
// @Router /courses/{id}/tasks [get]

func GetMiniTaskList(task_miniTask []*model.Task_Minitask, h *Handler) (miniTasks []*model.MiniTask) {

	db := h.DB.Clone()
	defer db.Close()

	for i := 0; i < len(task_miniTask); i++ {
		miniTask := &model.MiniTask{}
		db.DB(config.NameDb).C("minitasks").
			Find(
				bson.M{
					"_id": bson.ObjectIdHex(task_miniTask[i].MiniTaskID),
				},
			).One(&miniTask)
		fmt.Println(miniTask.MiniTaskName)
		miniTasks = append(miniTasks, miniTask)
	}

	//fmt.Println("Len")
	//for i:=0;i<len(miniTasks);i++ {
	//	fmt.Println()
	//	fmt.Println(miniTasks[i].MiniTaskName)
	//	fmt.Println()
	//}
	return miniTasks
}

func (h *Handler) AuthTaskByCoursesID(c echo.Context) (err error) {

	ta := []*model.Task{}

	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	fmt.Println(userID)

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("tasks").
		Find(bson.M{"course_id": id, "del": bson.M{"$ne": true}}).
		Skip((page - 1) * limit).
		Limit(limit).
		Sort("-timestamp").
		All(&ta); err != nil {
		return
	}

	for i := 0; i < len(ta); i++ {
		task_miniTask := []*model.Task_Minitask{}
		db.DB(config.NameDb).C("task_minitask").
			Find(bson.M{
				"task_id": ta[i].ID.Hex(),
			}).All(&task_miniTask)

		mta := GetMiniTaskList(task_miniTask, h)

		//mta := []*model.MiniTask{}

		//db.DB(config.NameDb).C("minitasks").
		//	Find(bson.M{
		//		"task_id": ta[i].ID.Hex(),
		//		"del":     bson.M{"$ne": true}},
		//	).
		//	All(&mta)

		userMiniTask := &model.UserMiniTask{}

		if err = db.DB(config.NameDb).C("user_minitask").
			Find(bson.M{
				"user_id": userID,
				"del":     bson.M{"$ne": true},
			}).
			One(&userMiniTask); err != nil {
			// if err == mgo.ErrNotFound {
			// 	uc.CourseInfo = []CourseInfo
			// }
			// isInDBUserMiniTask = false
			// return
		}
		vitri := -1

		for i := 0; i < len(mta); i++ {
			for j := 0; j < len(userMiniTask.MiniTaskInfo); j++ {
				if mta[i].ID.Hex() == userMiniTask.MiniTaskInfo[j].MiniTaskID &&
					userMiniTask.MiniTaskInfo[j].CourseID == id {
					vitri = i
					mta[i].Status = userMiniTask.MiniTaskInfo[j].Status
				}
			}
		}
		if vitri != -1 {
			mta[vitri].Vitri = true
		}
		if mta == nil {
			ta[i].Minitasks = []*model.MiniTask{}
		} else {
			ta[i].Minitasks = mta
		}
	}

	return c.JSON(http.StatusOK, ta)
}

// {
//     "name": "GoLang",
//     "task_solved": {
//         "taskCount": 20,
//         "tasks_complete": 3
//     },
//     "background_image": "https://loremflickr.com/500/500"
// }
// POST http://localhost:8080/courses

// CreateCourse godoc
// @Summary Create Course
// @Description Create Course
// @Tags Courses
// @Accept  json
// @Produce  json
// @Param  course body model.Course true "Create Course"
// @Success 200 {object} model.Course
// @Router /courses [post]
func (h *Handler) CreateCourse(c echo.Context) (err error) {

	pn := &model.Course{
		// ID: bson.NewObjectId(),
	}

	if err = c.Bind(pn); err != nil {
		return
	}

	if pn.ID == "" {
		pn.ID = bson.NewObjectId()
	}

	// Validation
	if pn.CourseName == "" || pn.BackgroundImage == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid to or message fields"}
	}

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// Save in database
	pn.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("course").Insert(pn); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	_, errUs := db.DB(config.NameDb).C("course").UpsertId(pn.ID, pn)
	if errUs != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, pn)

}

// review course

func (h *Handler) ReviewCourse(c echo.Context) (err error) {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	ID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Close()

	ur := &model.User{}

	if err = db.DB(config.NameDb).C("users").
		// FindId(bson.ObjectIdHex(ID)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(ID),
			"del": bson.M{"$ne": true},
		}).
		One(&ur); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}
		return
	}

	bk := &model.Course{}

	if err = db.DB(config.NameDb).C("course").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"id": ur.ID.Hex(),
			//"config_id": configApp.ID.Hex(),
			//"del":       bson.M{"$ne": true},
		}).
		One(&bk); err != nil {
		if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			// return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}

		}
		// returns
	}
	_, errUs := db.DB(config.NameDb).C("course").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}
	bk.Agree = false

	reviewCourseOut := &model.ReviewCourse{
		User:    ur,
		Courses: bk,
	}

	c.Response().Header().Set("x-total-count", strconv.Itoa(1))

	return c.JSON(http.StatusOK, reviewCourseOut)
}
