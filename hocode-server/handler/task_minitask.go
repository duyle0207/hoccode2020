package handler

import (
	"fmt"
	"github.com/duyle0207/hoccode2020/config"
	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
	"net/http"
)

func (h *Handler) GetTotalCourseMinitask(c echo.Context) (err error) {

	course_id := c.Param("course_id")

	db := h.DB.Clone()
	defer db.Close()

	list_task := []*model.Task{}

	db.DB(config.NameDb).C("tasks").
		Find(bson.M{
			"course_id": course_id,
		}).All(&list_task)

	fmt.Println(len(list_task))

	total_course_minitask := 0

	for i:=0;i< len(list_task);i++ {
		total_course_minitask += len(GetTotalTaskMinitask(list_task[i].ID.Hex(), h))
	}
	return c.JSON(http.StatusOK, total_course_minitask)
}

func GetTotalTaskMinitask(task_id string, h *Handler) (task_minitask []*model.Task_Minitask) {

	db := h.DB.Clone()
	defer  db.Close()

	db.DB(config.NameDb).C("task_minitask").
		Find(bson.M{
			"task_id": task_id,
		}).All(&task_minitask)
	return task_minitask
}
