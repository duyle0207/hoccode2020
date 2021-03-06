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

// Task godoc
// @Summary List Task
// @ID task_list
// @Description get tasks <a href="/api/v1/tasks?page=1&limit=5">/api/v1/tasks?page=1&limit=5</a>
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Success 200 {array} model.Task
// @Router /tasks [get]
func (h *Handler) Task(c echo.Context) (err error) {

	ta := []*model.Task{}
	// page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))

	fmt.Println("[LIMIT]")
	fmt.Println(limit)

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("tasks").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&ta); err != nil {
		return
	}

	for i := 0; i < len(ta); i++ {
		mta := []*model.MiniTask{}

		fmt.Println(ta[i].ID.Hex())
		fmt.Println()

		db.DB(config.NameDb).C("minitasks").
			Find(bson.M{
				"task_id": ta[i].ID.Hex(),
				"del":     bson.M{"$ne": true},
			}).
			Sort("-timestamp").
			All(&mta)
		ta[i].Minitasks = mta

	}

	c.Response().Header().Set("x-total-count", strconv.Itoa(len(ta)))
	return c.JSON(http.StatusOK, ta)

}

// TaskByID godoc
// @Summary Get Task By ID
// @Description get task by ID <a href="/api/v1/tasks/5d86f268fe6e2b31c0673b02">/api/v1/tasks/5d86f268fe6e2b31c0673b02</a>
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Param  id path int true "Task ID"
// @Success 200 {object} model.Task
// @Router /tasks/{id} [get]
func (h *Handler) TaskByID(c echo.Context) (err error) {

	tf := &model.Task{}

	id := c.Param("id")

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("tasks").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(id),
			"del": bson.M{"$ne": true},
		}).
		// Find(bson.M{}).
		// Select(bson.M{"id": id}).
		One(&tf); err != nil {
		if err == mgo.ErrNotFound {
			return &echo.HTTPError{Code: http.StatusBadRequest, Message: "tasks not found"}
		}

		return
	}

	mta := []*model.MiniTask{}
	userMiniTask := &model.UserMiniTask{}

	db.DB(config.NameDb).C("minitasks").
		Find(bson.M{
			"task_id": id,
			"del":     bson.M{"$ne": true},
		}).
		Sort("-timestamp").
		All(&mta)

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

	tf.Minitasks = mta

	vitri := -1

	for i := 0; i < len(mta); i++ {
		for j := 0; j < len(
			userMiniTask.MiniTaskInfo); j++ {
			if mta[i].ID.Hex() == userMiniTask.MiniTaskInfo[j].MiniTaskID {
				vitri = i
				mta[i].Status = userMiniTask.MiniTaskInfo[j].Status
			}

		}

	}

	if vitri != -1 {
		mta[vitri].Vitri = true
	}

	return c.JSON(http.StatusOK, tf)
}

// CreateTask godoc
// @Summary Create Task
// @Description Create Task
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Param  task body model.Task true "Create Task"
// @Success 200 {object} model.Task
// @Router /tasks [post]
func (h *Handler) CreateTask(c echo.Context) (err error) {

	tn := &model.Task{
		// ID: bson.NewObjectId(),
	}
	if err = c.Bind(tn); err != nil {
		return
	}

	if tn.ID == "" {
		tn.ID = bson.NewObjectId()
	}

	// Validation
	if tn.TaskName == "" || tn.CourseId == "" || tn.BackgroundImage == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid to or message fields"}
	}

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// TODO: update total_minitask in collection "Course"

	// Save in database
	tn.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("tasks").Insert(tn); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	_, errUs := db.DB(config.NameDb).C("tasks").UpsertId(tn.ID, tn)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, tn)
}

func GetMinitask_ID(id string, h *Handler) (minitask model.MiniTask){

	db := h.DB.Clone()
	defer db.Close()

	db.DB(config.NameDb).C("minitasks").Find(bson.M{
		"_id": bson.ObjectIdHex(id),
	}).One(&minitask)

	return minitask
}

func (h *Handler) IsPassTask(c echo.Context) (err error) {

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	course_id := c.Param("course_id")
	//fmt.Println("[course_id]")
	//fmt.Println(course_id)
	//
	//fmt.Println("[UserID]")
	//fmt.Println(userID)
	//
	db := h.DB.Clone()
	defer db.Close()

	// Find tasks in Course
	user_minitask_list := []*model.UserMiniTask{}
	db.DB(config.NameDb).C("user_minitask").Find(bson.M{
		"user_id": userID,
	}).All(&user_minitask_list)


	task_list := []*model.Task{}
	total_minitask := 0
	db.DB(config.NameDb).C("tasks").Find(bson.M{
		"course_id": course_id,
	}).All(&task_list)

	total_point := 0
	for i:=0;i < len(task_list);i++{
		total_minitask += len(GetTotalTaskMinitask(task_list[i].ID.Hex(), h))
		task_minitask := GetTotalTaskMinitask(task_list[i].ID.Hex(), h)
		for j:=0;j<len(task_minitask);j++{
			total_point += GetMinitask_ID(task_minitask[j].MiniTaskID, h).CodePoint
		}
	}

	count_Completed_Minitask := 0
	user_code_point := 0
	for i:=0;i< len(user_minitask_list);i++{
		for j:=0;j<len(user_minitask_list[i].MiniTaskInfo);j++{
			if user_minitask_list[i].MiniTaskInfo[j].CourseID == course_id {
				count_Completed_Minitask++
				user_code_point += GetMinitask_ID(user_minitask_list[i].MiniTaskInfo[j].MiniTaskID, h).CodePoint
			}
		}
	}

	course_pass_info := model.CoursePassInfo{}

	course_pass_info.CourseID = course_id
	course_pass_info.MinitaskSoved = count_Completed_Minitask
	course_pass_info.TotalMiniTask = total_minitask
	course_pass_info.ToTalPoint = total_point
	course_pass_info.UserCodePoint = user_code_point
	if total_point == user_code_point && total_minitask != 0{
		course_pass_info.IsCodePass =  true
	} else {
		course_pass_info.IsCodePass = false
	}
	return c.JSON(http.StatusOK, course_pass_info)
}

