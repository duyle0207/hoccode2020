package handler

import (
	"fmt"
	"github.com/duyle0207/hoccode2020/config"
	"net/http"
	"strconv"
	"time"

	"github.com/duyle0207/hoccode2020/models"

	"github.com/dgrijalva/jwt-go"
	//model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// GetUserCourse godoc
// @Summary List GetUserCourse
// @Description get GetUserCourse
// @Tags UserCourse
// @Accept  json
// @Produce  json
// @Success 200 {object} model.UserCourse
// @Router /auth/usercourse [get]
func (h *Handler) GetUserCourse(c echo.Context) (err error) {

	uc := &model.UserCourse{}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	ID := claims["id"].(string)
	fmt.Println("ID")
	fmt.Println(ID)

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("user_course").
		Find(bson.M{
			"user_id": ID,
			"del":     bson.M{"$ne": true},
		}).
		One(&uc); err != nil {
		if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			uc.CourseInfo = []*model.CourseInfo{}
			return c.JSON(http.StatusOK, uc)
		}
		return
	}

	return c.JSON(http.StatusOK, uc)

}

func (h *Handler) GetUserCourseProfile(c echo.Context) (err error) {

	uc := &model.UserCourse{}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	ID := claims["id"].(string)
	fmt.Println("ID")
	fmt.Println(ID)

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("user_course").
		Find(bson.M{
			"user_id": ID,
			"del":     bson.M{"$ne": true},
		}).
		One(&uc); err != nil {
		if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			uc.CourseInfo = []*model.CourseInfo{}
			return c.JSON(http.StatusOK, uc)
		}
		return
	}

	courses := []*model.Course{}
	for i :=range uc.CourseInfo {
		fmt.Println(i)
		if i<3 {
			course := &model.Course{}
			db.DB(config.NameDb).C("course").Find(bson.M{
				"_id": bson.ObjectIdHex(uc.CourseInfo[i].CourseID),
			}).One(&course)
			courses = append(courses, course)
		}
	}

	return c.JSON(http.StatusOK, courses)

}

//func GetMiniTaskByID(id string, h *Handler) (minitask model.MiniTask) {
//
//	db := h.DB.Clone()
//	defer db.Close()
//
//	db.DB(config.NameDb).C("minitask").Find(bson.M{
//		"_id": id,
//	}).One(&minitask)
//	return minitask
//}

// UpdateUserCourse godoc
// @Summary UpdateUserCourse
// @Description UpdateUserCourse
// @Tags UserCourse
// @Accept  json
// @Produce  json
// @Param  course body model.BodyUC true "UpdateUserCourse"
// @Success 200 {object} model.UserCourseOut
// @Router /auth/updateusercourse [post]
func (h *Handler) GetListUserCourse(c echo.Context) (err error) {
	userCourse := []*model.UserCourse{}

	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("user_course").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&userCourse); err != nil {
		return
	}
	c.Response().Header().Set("x-total-count", strconv.Itoa(len(userCourse)))

	return c.JSON(http.StatusOK, userCourse)
}

func (h *Handler) UpdateUserCourse(c echo.Context) (err error) {

	uc := &model.UserCourse{}

	course_id := c.Param("course_id")

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	bodyUC := &model.BodyUC{}

	if err = c.Bind(bodyUC); err != nil {
		return
	}

	// courseID := c.Param("course_id")
	// miniTaskID := c.Param("minitask_id")

	// Validation
	if bodyUC.TaskID == "" || bodyUC.MiniTaskID == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid task_id or minitask_id fields"}
	}

	if userID == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid jwt"}
	}

	db := h.DB.Clone()
	defer db.Close()

	mta := []*model.Task_Minitask{}

	db.DB(config.NameDb).C("task_minitask").
		Find(bson.M{
			"task_id": bodyUC.TaskID,
			"del":     bson.M{"$ne": true},
		}).
		Sort("-timestamp").
		All(&mta)

	//taskf.Minitasks = mta
	fmt.Println("[TaskID]")
	fmt.Println(bodyUC.TaskID)
	fmt.Println(bodyUC.CourseID)
	fmt.Println("MTA len")
	fmt.Println(len(mta))

	//course_id = taskf.CourseId

	uc.UserID = userID

	isInDB := true
	// Find old db user_course
	if err = db.DB(config.NameDb).C("user_course").
		Find(bson.M{
			"user_id": userID,
			"del":     bson.M{"$ne": true},
		}).
		One(&uc); err != nil {
		// if err == mgo.ErrNotFound {
		// 	uc.CourseInfo = []CourseInfo
		// }
		isInDB = false
		fmt.Println("NOT FOUND")
		// return
	}

	// get title from course
	course := &model.Course{}
	if err = db.DB(config.NameDb).C("course").
		// FindId(bson.ObjectIdHex(bodyUC.CourseID)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(course_id),
			"del": bson.M{"$ne": true},
		}).
		One(&course); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}

		return
	}

	// Check Course deadline
	now := time.Now()
	course_status := -100
	if now.Sub(course.StartTime).Seconds() < 0 {
		course_status = -1
	} else if course.StartTime.Sub(now).Seconds() < 0 && now.Sub(course.EndTime).Seconds() < 0 {
		course_status = 0
	} else if now.Sub(course.EndTime).Seconds() > 0 {
		course_status = 1
	}

	userMiniTask := &model.UserMiniTask{}

	userMiniTask.UserID = userID

	isInDBUserMiniTask := true

	codePoint := 0

	// Get mini.task and get mini.task's point
	minitask_point := 0
	mtf := &model.MiniTask{}
	if err = db.DB(config.NameDb).C("minitasks").
		// FindId(bson.ObjectIdHex(bodyUC.MiniTaskID)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(bodyUC.MiniTaskID),
			"del": bson.M{"$ne": true},
		}).
		One(&mtf); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}
	}
	minitask_point = mtf.CodePoint

	// Get User minitask
	if err = db.DB(config.NameDb).C("user_minitask").
		Find(bson.M{
			"user_id": userID,
			"del":     bson.M{"$ne": true},
		}).
		One(&userMiniTask); err != nil {
		isInDBUserMiniTask = false
	}

	// Find if mini task is in user_mini.task or not
	uMiniTaskLocationC := -1
	if len(userMiniTask.MiniTaskInfo) != 0 {
		for i := 0; i < len(userMiniTask.MiniTaskInfo); i++ {
			if userMiniTask.MiniTaskInfo[i].MiniTaskID == bodyUC.MiniTaskID &&
				userMiniTask.MiniTaskInfo[i].CourseID == course_id {
				uMiniTaskLocationC = i
			}
		}
	}

	// To check if we update point or not
	isUpdatePoint := true

	// Found Mini task in user_mini.task
	if uMiniTaskLocationC != -1 {
		if userMiniTask.MiniTaskInfo[uMiniTaskLocationC].Status == "hoanthanh" {
			fmt.Println("hoan thanh roi")
			isUpdatePoint = false
		} else {
			// Assign mini task completed
			userMiniTask.MiniTaskInfo[uMiniTaskLocationC].Status = "hoanthanh"
			userMiniTask.MiniTaskInfo[uMiniTaskLocationC].MiniTaskID = bodyUC.MiniTaskID
		}
	} else { // Not found mini task in user_mini.task
		// Create new mini task info
		miniTaskIn := &model.MiniTaskInfo{}
		miniTaskIn.Status = "hoanthanh"
		miniTaskIn.MiniTaskID = bodyUC.MiniTaskID
		miniTaskIn.CourseID = course_id
		miniTaskIn.TaskID = bodyUC.TaskID
		isUpdatePoint = true

		// Insert mini task into Mini.task info
		userMiniTask.MiniTaskInfo = append(userMiniTask.MiniTaskInfo, miniTaskIn)
	}

	userTemp := &model.User{}
	db.DB(config.NameDb).C("users").Find(bson.M{"_id": bson.ObjectIdHex(userID)}).One(&userTemp)

	codePoint = userTemp.CodePoint
	userMiniTask.Timestamp = time.Now()


	// It is in DB so update status
	if isInDBUserMiniTask {
		if err = db.DB(config.NameDb).
			C("user_minitask").
			Update(bson.M{"user_id": userMiniTask.UserID}, userMiniTask); err != nil {
			if err == mgo.ErrNotFound {
				return echo.ErrInternalServerError
			}
			return
		}
	} else { // isn't in DB create
		userMiniTask.ID = bson.NewObjectId()
		if err = db.DB(config.NameDb).C("user_minitask").Insert(userMiniTask); err != nil {
			fmt.Println(err)
			return echo.ErrInternalServerError
		}
	}

	// Get next mini.task
	nextMiniTask := &model.MiniTask{}
	for i := range mta {
		if mta[i].MiniTaskID == bodyUC.MiniTaskID {
			// Found!
			mtf := &model.MiniTask{}
			if err = db.DB(config.NameDb).C("minitasks").
				// FindId(bson.ObjectIdHex(id)).
				Find(bson.M{
					"_id": bson.ObjectIdHex(mta[i].MiniTaskID),
					"del": bson.M{"$ne": true},
				}).
				One(&mtf); err != nil {
				if err == mgo.ErrNotFound {
					return echo.ErrNotFound
				}
			}
			fmt.Println("[Current] Minitask")
			fmt.Println(mtf.MiniTaskName)

			if i+1 < len(mta) {
				mtf := &model.MiniTask{}
				if err = db.DB(config.NameDb).C("minitasks").
					// FindId(bson.ObjectIdHex(id)).
					Find(bson.M{
						"_id": bson.ObjectIdHex(mta[i+1].MiniTaskID),
						"del": bson.M{"$ne": true},
					}).
					One(&mtf); err != nil {
					if err == mgo.ErrNotFound {
						return echo.ErrNotFound
					}
				}
				fmt.Println("[Next] Minitask")
				fmt.Println(mtf.MiniTaskName)
				nextMiniTask = mtf
			}
		}
	}

	// Check if user_course is in DB
	ucLocationC := -1
	if len(uc.CourseInfo) != 0 {
		for i := 0; i < len(uc.CourseInfo); i++ {
			if uc.CourseInfo[i].CourseID == bodyUC.CourseID {
				ucLocationC = i
			}
		}
	}

	if ucLocationC != -1 {
		uc.CourseInfo[ucLocationC].CourseName = course.CourseName
	} else {
		courseInfo := &model.CourseInfo{}
		fmt.Println("[Course ID")
		fmt.Println(bodyUC.CourseID)
		courseInfo.CourseID = bodyUC.CourseID
		courseInfo.CourseName = course.CourseName
		courseInfo.BackgroundImage = course.BackgroundImage
		uc.CourseInfo = append(uc.CourseInfo, courseInfo)
	}

	// Update user, user_course point
	if isInDB {
		uc.Timestamp = time.Now()
		if err = db.DB(config.NameDb).
			C("user_course").
			Update(bson.M{"user_id": uc.UserID}, uc); err != nil {
			if err == mgo.ErrNotFound {
				return echo.ErrInternalServerError
			}
			return
		}
		if course_status == 0 && isUpdatePoint{
			UpdateUserPoint(userID, minitask_point, course_id, h)
		}
	} else {
		uc.ID = bson.NewObjectId()
		// Save in database
		uc.Timestamp = time.Now()
		if err = db.DB(config.NameDb).C("user_course").Insert(uc); err != nil {
			fmt.Println("[err]")
			fmt.Println(err)
			return echo.ErrInternalServerError
		}
		if course_status == 0 && isUpdatePoint{
			UpdateUserPoint(userID, minitask_point, course_id, h)
		}
	}

	userCourseOut := &model.UserCourseOut{
		UserCourse:   uc,
		UserMiniTask: userMiniTask,
		NextMiniTask: nextMiniTask,
		CodePoint:    codePoint,
	}
	return c.JSON(http.StatusOK, userCourseOut)
}

func UpdateUserPoint(userID string, point int, course_id string, h *Handler) {

	fmt.Println("[Cộng điểm]")
	db := h.DB.Clone()
	defer db.Close()

	fmt.Println(userID)

	// Update user point
	ur := model.User{}
	db.DB(config.NameDb).C("users").
		Find(bson.M{
			"_id": bson.ObjectIdHex(userID),
		}).
		One(&ur)

	fmt.Println(ur.Email)

	ur.CodePoint = ur.CodePoint + point

	db.DB(config.NameDb).
		C("users").
		Update(bson.M{"_id": bson.ObjectIdHex(userID)}, ur)

	// Update user course point
	user_course := &model.UserCourse{}

	db.DB(config.NameDb).
		C("user_course").
		Find(bson.M{
			"user_id":userID,
		}).One(&user_course)

	for i := range user_course.CourseInfo {
		if user_course.CourseInfo[i].CourseID == course_id {
			user_course.CourseInfo[i].CodePoint = user_course.CourseInfo[i].CodePoint + point
		}
	}
	fmt.Printf("User code point: %d\n", user_course.UserPoint)
	_, _ = db.DB(config.NameDb).C("user_course").UpsertId(user_course.ID, user_course)
}

func (h *Handler) NextMiniTask(c echo.Context) (err error) {

	bodyUC := &model.BodyUC{}

	if err = c.Bind(bodyUC); err != nil {
		return
	}

	// Validation
	if bodyUC.MiniTaskID == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid minitask_id fields"}
	}

	nextMiniTask := &model.MiniTask{}

	db := h.DB.Clone()
	defer db.Close()

	nextMiniTask.Timestamp = time.Now()
	if err = db.DB(config.NameDb).C("minitasks").
		Find(
			bson.M{
				"_id": bson.M{
					"$gt": bson.ObjectIdHex(bodyUC.MiniTaskID),
				},
				"del": bson.M{"$ne": true},
			},
		).
		Sort("-timestamp").
		Select(bson.M{"_id": 1, "mini_task_name": 1}).
		Limit(1).
		One(&nextMiniTask); err != nil {
	}

	return c.JSON(http.StatusOK, nextMiniTask)

}
