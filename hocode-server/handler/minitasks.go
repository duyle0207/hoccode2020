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

// Minitasks godoc
// @Summary List Minitasks
// @ID minitask_list
// @Description get List Minitasks <a href="/api/v1/minitasks?page=1&limit=5">/api/v1/minitasks?page=1&limit=5</a>
// @Tags Minitasks
// @Accept  json
// @Produce  json
// @Success 200 {array} model.MiniTask
// @Router /minitasks [get]

func (h *Handler) SearchMinitasks(c echo.Context) (err error) {

	minitaskList := []*model.MiniTask{}

	mini_task_name := c.Param("mini_task_name")

	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("minitasks").
		Find(bson.M{
			"mini_task_name": bson.RegEx{mini_task_name, ""} ,
			"del": bson.M{"$ne": true},
		}).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&minitaskList); err != nil {
		return
	}
	len, _ := db.DB(config.NameDb).C("minitasks").Count()
	c.Response().Header().Set("x-total-count", strconv.Itoa(len))

	return c.JSON(http.StatusOK, minitaskList)
}

func (h *Handler) GetMiniTaskByTaskID(c echo.Context) (err error) {

	taskID := c.Param("id")

	db := h.DB.Clone()
	defer db.Clone()

	task_minitask := []*model.Task_Minitask{}

	db.DB(config.NameDb).C("task_minitask").
		Find(bson.M{
			"task_id": taskID,
	}).All(&task_minitask)

	miniTaskList := []*model.MiniTask{}

	for i:=0;i<len(task_minitask); i++ {
		miniTask := &model.MiniTask{}
		db.DB(config.NameDb).C("minitasks").
			Find(
				bson.M{
					"_id": bson.ObjectIdHex(task_minitask[i].MiniTaskID),
				},
			).One(&miniTask)
		//fmt.Println(miniTask.MiniTaskName)
		miniTaskList = append(miniTaskList, miniTask)
	}

	return c.JSON(http.StatusOK, miniTaskList)
}

func (h *Handler) CreateTaskMinTask(c echo.Context) (err error) {

	bk := &model.Task_Minitask{
		// ID: bson.NewObjectId(),
	}

	if err = c.Bind(bk); err != nil {
		return
	}

	if bk.ID == "" {
		bk.ID = bson.NewObjectId()
	}

	db := h.DB.Clone()
	defer db.Close()

	_, errUs := db.DB(config.NameDb).C("task_minitask").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)
}

func (h *Handler) DeleteTaskMinitask(c echo.Context) (err error) {

	bk := &model.Task_Minitask{
		// ID: bson.NewObjectId(),
	}

	//user := c.Get("user").(*jwt.Token)
	//claims := user.Claims.(jwt.MapClaims)
	//userID := claims["id"].(string)user := c.Get("user").(*jwt.Token)
	//	//claims := user.Claims.(jwt.MapClaims)
	//	//userID := claims["id"].(string)

	if err = c.Bind(bk); err != nil {
		return
	}

	//bk.ID = bson.ObjectIdHex(id)

	// Validation
	//if bk.ID == "" {
	//	return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid id fields"}
	//}

	task_id := c.Param("task_id")
	minitask_id := c.Param("minitask_id")
	course_id := c.Param("course_id")

	fmt.Println("[TaskID]")
	fmt.Println(task_id)

	bk.TaskID = task_id
	bk.MiniTaskID = minitask_id

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	bk.Del = true
	if err = db.DB(config.NameDb).C("task_minitask").Remove(
		bson.M{
			"mini_task_id": bk.MiniTaskID,
			"task_id": bk.TaskID,
		}); err != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}
	}

	user_minitask := []*model.UserMiniTask{}
	if err = db.DB(config.NameDb).C("user_minitask").Find(
		bson.M{}).All(&user_minitask); err != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}
	}

	for j:=0;j<len(user_minitask);j++{
		for i := 0;i<len(user_minitask[j].MiniTaskInfo);i++{
			if user_minitask[j].MiniTaskInfo[i].CourseID == course_id &&
				user_minitask[j].MiniTaskInfo[i].MiniTaskID == minitask_id &&
				user_minitask[j].MiniTaskInfo[i].TaskID == task_id {
				user_minitask[j].MiniTaskInfo = UpdateMinitaskInfo(i, user_minitask[j].MiniTaskInfo)
				db.DB(config.NameDb).C("user_minitask").UpsertId(user_minitask[j].ID, user_minitask[j])
			}
		}
	}


	//fmt.Println("[Index]")
	//fmt.Println(index)

	//if index != -1 {
	//	//	//user_minitask.MiniTaskInfo = UpdateMinitaskInfo(index, user_minitask.MiniTaskInfo)
	//	//}

	//user_minitask.MiniTaskInfo = []*model.MiniTaskInfo{}

	//for x:=0;x< len(user_minitask.MiniTaskInfo);x++{
	//	fmt.Println(user_minitask.MiniTaskInfo[x].MiniTaskID)
	//}
	//
	//fmt.Println("[new Len]")
	//fmt.Println(len(user_minitask.MiniTaskInfo))
	//
	//db.DB(config.NameDb).C("user_minitask").Update(
	//	bson.M{
	//	"user_id": userID,
	//},user_minitask)

	return c.JSON(http.StatusOK, bk)
}

func UpdateMinitaskInfo(index int, MinitaskInfo []*model.MiniTaskInfo) (minitaskInfo []*model.MiniTaskInfo) {
	minitaskInfo = append(MinitaskInfo[:index],MinitaskInfo[index+1:]...)
	return minitaskInfo
}

func (h *Handler) Minitasks(c echo.Context) (err error) {

	var mta []*model.MiniTask
	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("minitasks").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&mta); err != nil {
		return
	}

	c.Response().Header().Set("x-total-count", strconv.Itoa(len(mta)))
	return c.JSON(http.StatusOK, mta)
}

// MinitasksByID godoc
// @Summary Get Minitasks By ID
// @Description get Minitasks by ID <a href="/api/v1/minitasks/5d995ae8fe6e2b0ca40b22fe">/api/v1/minitasks/5d995ae8fe6e2b0ca40b22fe</a>
// @Tags Minitasks
// @Accept  json
// @Produce  json
// @Param  id path int true "Minitask ID"
// @Success 200 {object} model.MiniTask
// @Router /minitasks/{id} [get]
func (h *Handler) MinitasksByID(c echo.Context) (err error) {

	mtf := &model.MiniTask{}

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("minitasks").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(id),
			"del": bson.M{"$ne": true},
		}).
		One(&mtf); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}

		return
	}

	return c.JSON(http.StatusOK, mtf)
}

// CreateMinitast godoc
// @Summary Create Minitast
// @Description Create MiniTask
// @Tags Minitasks
// @Accept  json
// @Produce  json
// @Param  task body model.MiniTask true "Create MiniTask"
// @Success 200 {object} model.MiniTask
// @Router /minitasks [post]
func (h *Handler) CreateMinitast(c echo.Context) (err error) {

	mtn := &model.MiniTask{
		// ID: bson.NewObjectId(),
	}
	if err = c.Bind(mtn); err != nil {
		return
	}

	if mtn.ID == "" {
		mtn.ID = bson.NewObjectId()
	}
	// Validation
	if mtn.MiniTaskName == "" || mtn.TaskId == "" || mtn.Status == "" || mtn.NameFunc == "" || mtn.MinitaskDesc == "" || mtn.TemplateCode == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid to or message fields"}
	}

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	// Save in database
	mtn.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("minitasks").Insert(mtn); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	// TODO: Update total_minitask từ bảng course

	if mtn.TaskId != "" {

		tf := &model.Task{}

		db.DB(config.NameDb).C("tasks").
			Find(bson.M{
				"del": bson.M{"$ne": true},
				"_id": bson.ObjectIdHex(mtn.TaskId),
			}).One(&tf)

		if tf.CourseId != "" {

			listtaskf := []*model.Task{}

			if err = db.DB(config.NameDb).C("tasks").
				Find(bson.M{
					"del":       bson.M{"$ne": true},
					"course_id": tf.CourseId,
				}).
				Sort("-timestamp").
				All(&listtaskf); err != nil {
				return
			}

			co := &model.Course{}

			db.DB(config.NameDb).C("course").
				Find(bson.M{
					"del": bson.M{"$ne": true},
					"_id": bson.ObjectIdHex(tf.CourseId),
				}).One(&co)

			totallen := 0

			if len(listtaskf) != 0 {
				for i := 0; i < len(listtaskf); i++ {
					len, _ := db.DB(config.NameDb).C("minitasks").
						Find(bson.M{
							"task_id": listtaskf[i].ID.Hex(),
							"del":     bson.M{"$ne": true},
						}).Count()
					totallen += len
				}
			}

			co.TotalMinitask = totallen + 1

			// Save in database
			co.Timestamp = time.Now()

			co.Tasks = []*model.Task{}

			db.DB(config.NameDb).C("course").UpsertId(co.ID, co)

		}

	}
	_, errUs := db.DB(config.NameDb).C("minitasks").UpsertId(mtn.ID, mtn)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, mtn)

}

func (h *Handler) DailyMiniTask(c echo.Context) (err error) {

	limit, errorLimit := strconv.Atoi(c.QueryParam("limit"))
	if errorLimit != nil {
		limit = 4
	}
	mta := []*model.MiniTask{}

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("minitasks").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Select().
		Limit(limit).
		Sort("-timestamp").
		All(&mta); err != nil {
		return
	}

	//for i:=0;i<len(mta);i++ {
	//	fmt.Println(mta[i].TaskId)
	//	fmt.Println(bson.ObjectIdHex(mta[i].TaskId))
	//	fmt.Println("")
	//}

	for i := 0; i < len(mta); i++ {

		tf := &model.Task{}
		fmt.Println(mta[i].TaskId)
		if err = db.DB(config.NameDb).C("tasks").
			// FindId(bson.ObjectIdHex(mta[i].TaskId)).
			Find(bson.M{
				"_id": bson.ObjectIdHex(mta[i].TaskId),
				"del": bson.M{"$ne": true},
			}).
			// Find(bson.M{}).
			// Select(bson.M{"id": id}).
			One(&tf); err != nil {
			if err == mgo.ErrNotFound {
				fmt.Println("error")
				return echo.ErrNotFound
			}
			return
		}
		mta[i].Avatar = tf.BackgroundImage
	}
	for i:=0;i<len(mta);i++ {
		fmt.Println(i)
		fmt.Println(mta[i].Avatar)
		fmt.Println(i)
	}	
	return c.JSON(http.StatusOK, mta)
}
