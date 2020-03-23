package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/duyle0207/hoccode2020/config"

	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Tasks godoc
// @Summary List Tasks
// @ID tasks_list
// @Description get tasks <a href="/api/v1/tasks?page=1&limit=5">/api/v1/tasks?page=1&limit=5</a>
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Success 200 {array} model.Task
// @Router /tasks [get]
func (h *Handler) GetListTasks(c echo.Context) (err error) {

	bk := []*model.Task{}

	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("tasks").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&bk); err != nil {
		return
	}
	c.Response().Header().Set("x-total-count", strconv.Itoa(len(bk)))

	return c.JSON(http.StatusOK, bk)

}

// Tasks godoc
// @Summary One Tasks
// @ID tasks_one
// @Description get tasks <a href="/api/v1/tasks?page=1&limit=5">/api/v1/tasks?page=1&limit=5</a>
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Success 200 {object} model.Task
// @Router /tasks/:id [get]
func (h *Handler) GetOneTasks(c echo.Context) (err error) {

	bk := &model.Task{}

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("tasks").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(id),
			"del": bson.M{"$ne": true},
		}).
		One(&bk); err != nil {
		if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}

		}

		return
	}

	c.Response().Header().Set("x-total-count", strconv.Itoa(1))

	return c.JSON(http.StatusOK, bk)

}

// Tasks godoc
// @Summary UpdateTasks Task
// @ID tasks_update
// @Description Update Task
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Param  task body model.Task true "Update Task"
// @Success 200 {object} model.Task
// @Router /tasks/:id [put]
func (h *Handler) UpdateTasks(c echo.Context) (err error) {

	bk := &model.Task{
		// ID: bson.NewObjectId(),
	}

	id := c.Param("id")

	if err = c.Bind(bk); err != nil {
		return
	}
	bk.ID = bson.ObjectIdHex(id)
	if bk.ID == "" {
		bk.ID = bson.NewObjectId()
	}

	// Validation
	// if bk.Title == "" || bk.Image == "" || bk.Content == "" {
	// 	return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid title or image fields"}
	// }

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// Save in database
	bk.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("tasks").Insert(bk); err != nil {
	// 	return echo.ErrInternalServerError
	// }
	fmt.Println("[ID]")
	fmt.Println(id)
	task_db := &model.Task{}
	db.DB(config.NameDb).C("tasks").Find(bson.M{
		"_id": bson.ObjectIdHex(id),
	}).One(&task_db)

	fmt.Println("[DB]")
	fmt.Println(task_db.CourseId)
	fmt.Println("[WEB")
	fmt.Println(bk.CourseId)

	user_minitask_list := []*model.UserMiniTask{};
	db.DB(config.NameDb).C("user_minitask").Find(bson.M{}).All(&user_minitask_list)

	if task_db.CourseId != bk.CourseId && len(user_minitask_list)!=0{
		for i := range user_minitask_list{
			index := 0
			for j,v := range user_minitask_list[i].MiniTaskInfo {
				if user_minitask_list[i].MiniTaskInfo[j].CourseID != task_db.CourseId ||
					user_minitask_list[i].MiniTaskInfo[j].TaskID != task_db.ID.Hex() {
					fmt.Println("[Thỏa]")
					user_minitask_list[i].MiniTaskInfo[index] = v
					index++
				}
			}
			user_minitask_list[i].MiniTaskInfo = user_minitask_list[i].MiniTaskInfo[:index]
			_, errMinitask := db.DB(config.NameDb).C("user_minitask").UpsertId(user_minitask_list[i].ID, user_minitask_list[i])
			if errMinitask != nil {
				// return echo.ErrInternalServerError
				return &echo.HTTPError{Code: http.StatusBadRequest, Message: errMinitask}
			}
		}
	}

	_, errUs := db.DB(config.NameDb).C("tasks").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)

}

// Tasks godoc
// @Summary Create Task
// @ID tasks_create
// @Description Create Task
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Param  task body model.Task true "Create Task"
// @Success 200 {object} model.Task
// @Router /tasks [post]
func (h *Handler) CreateTasks(c echo.Context) (err error) {

	bk := &model.Task{
		// ID: bson.NewObjectId(),
	}
	if err = c.Bind(bk); err != nil {
		return
	}

	if bk.ID == "" {
		bk.ID = bson.NewObjectId()
	}

	// Validation
	// if bk.Title == "" || bk.Image == "" || bk.Content == "" {
	// 	return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid title or image fields"}
	// }

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// Save in database
	bk.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("tasks").Insert(bk); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	_, errUs := db.DB(config.NameDb).C("tasks").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)

}

// Tasks godoc
// @Summary Delete Task
// @ID tasks_delete
// @Description Delete Task
// @Tags Tasks
// @Accept  json
// @Produce  json
// @Param  task body model.Task true "Delete Task"
// @Success 200 {object} model.Task
// @Router /tasks/:id [delete]
func (h *Handler) DeleteTasks(c echo.Context) (err error) {

	bk := &model.Task{
		// ID: bson.NewObjectId(),
	}

	if err = c.Bind(bk); err != nil {
		return
	}

	id := c.Param("id")

	bk.ID = bson.ObjectIdHex(id)

	// if bk.ID == "" {
	// 	bk.ID = bson.NewObjectId()
	// }

	// Validation
	if bk.ID == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid id fields"}
	}

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// Save in database
	bk.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("tasks").Insert(bk); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	bk.Del = true
	if err = db.DB(config.NameDb).C("tasks").Update(bson.M{"_id": bk.ID}, bson.M{"$set": bson.M{"del": true}}); err != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}
	}

	// _, errUs := db.DB(config.NameDb).C("tasks").UpsertId(bk.ID, bk)
	// if errUs != nil {
	// 	// return echo.ErrInternalServerError
	// 	return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	// }

	return c.JSON(http.StatusOK, bk)

}
