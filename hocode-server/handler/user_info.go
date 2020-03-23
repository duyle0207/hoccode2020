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

	//taskf := &model.Task{}
	//
	//if err = db.DB(config.NameDb).C("tasks").
	//	// FindId(bson.ObjectIdHex(bodyUC.TaskID)).
	//	Find(bson.M{
	//		"_id": bson.ObjectIdHex(bodyUC.TaskID),
	//		"del": bson.M{"$ne": true},
	//	}).
	//	// Find(bson.M{}).
	//	// Select(bson.M{"id": id}).
	//	One(&taskf); err != nil {
	//	if err == mgo.ErrNotFound {
	//		return echo.ErrNotFound
	//	}
	//
	//	return
	//}

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
		// return
	}

	ucLocationC := -1

	if len(uc.CourseInfo) != 0 {
		for i := 0; i < len(uc.CourseInfo); i++ {
			if uc.CourseInfo[i].CourseID == course_id {
				ucLocationC = i
			}
		}
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

	now := time.Now()
	course_status := 0
	fmt.Println(course.StartTime)

	if now.Sub(course.StartTime).Seconds() < 0 {
		course_status = -1
	} else if course.StartTime.Sub(now).Seconds() < 0 && now.Sub(course.EndTime).Seconds() < 0 {
		course_status = 0
	} else if now.Sub(course.EndTime).Seconds() > 0 {
		course_status = 1
	}
	// taskf := &model.Task{}

	// if err = db.DB(config.NameDb).C("tasks").
	// 	Find(bson.M{
	// 		"course_id": bodyUC.CourseID,
	// 		"del":       bson.M{"$ne": true},
	// 	}).
	// 	One(&taskf); err != nil {
	// 	if err == mgo.ErrNotFound {
	// 		return echo.ErrNotFound
	// 	}

	// 	return
	// }

	userMiniTask := &model.UserMiniTask{}

	userMiniTask.UserID = userID

	isInDBUserMiniTask := true

	codePoint := 0

	if err = db.DB(config.NameDb).C("user_minitask").
		Find(bson.M{
			"user_id": userID,
			"del":     bson.M{"$ne": true},
		}).
		One(&userMiniTask); err != nil {
		// if err == mgo.ErrNotFound {
		// 	uc.CourseInfo = []CourseInfo
		// }
		isInDBUserMiniTask = false
		// return
	}
	uMiniTaskLocationC := -1

	if len(userMiniTask.MiniTaskInfo) != 0 {
		for i := 0; i < len(userMiniTask.MiniTaskInfo); i++ {
			if userMiniTask.MiniTaskInfo[i].MiniTaskID == bodyUC.MiniTaskID && userMiniTask.MiniTaskInfo[i].CourseID == course_id {
				uMiniTaskLocationC = i
			}
		}
	}
	ur := &model.User{}

	if err = db.DB(config.NameDb).
		C("users").
		// FindId(bson.ObjectIdHex(userID)).
		Find(bson.M{
			"_id": bson.ObjectIdHex(userID),
			"del": bson.M{"$ne": true},
		}).
		// Find(bson.M{"_id": userID}).
		One(&ur); err != nil {
		if err == mgo.ErrNotFound {
			return echo.ErrNotFound
		}

		return
	}

	if uMiniTaskLocationC != -1 {
		userMiniTask.MiniTaskInfo[uMiniTaskLocationC].Status = "hoanthanh"
		userMiniTask.MiniTaskInfo[uMiniTaskLocationC].MiniTaskID = bodyUC.MiniTaskID

	} else {
		miniTaskIn := &model.MiniTaskInfo{}
		miniTaskIn.Status = "hoanthanh"
		miniTaskIn.MiniTaskID = bodyUC.MiniTaskID
		miniTaskIn.CourseID = course_id
		miniTaskIn.TaskID = bodyUC.TaskID

		// Cộng điểm cho user
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

		// ur, eur := claims["data"].(model.User)

		// if eur != true { return c.JSON(http.StatusBadRequest, eur)}

		// preStatus := userMiniTask.MiniTaskInfo[uMiniTaskLocationC].Status

		// if preStatus != "hoanthanh" {
		// }

		ur.CodePoint = ur.CodePoint + mtf.CodePoint
		ur.Timestamp = time.Now()
		fmt.Println("[Course status]")
		fmt.Println(course_status)
		if course_status == 0 {
			if err = db.DB(config.NameDb).
				C("users").
				Update(bson.M{"_id": bson.ObjectIdHex(userID)}, ur); err != nil {
				if err == mgo.ErrNotFound {
					return echo.ErrNotFound
				}
				return
			}
		}
		userMiniTask.MiniTaskInfo = append(userMiniTask.MiniTaskInfo, miniTaskIn)
	}

	codePoint = ur.CodePoint
	userMiniTask.Timestamp = time.Now()


	if isInDBUserMiniTask {
		if err = db.DB(config.NameDb).
			C("user_minitask").
			Update(bson.M{"user_id": userMiniTask.UserID}, userMiniTask); err != nil {
			if err == mgo.ErrNotFound {
				return echo.ErrInternalServerError
			}

			return
		}
	} else {
		userMiniTask.ID = bson.NewObjectId()
		if err = db.DB(config.NameDb).C("user_minitask").Insert(userMiniTask); err != nil {
			fmt.Println("[err]")
			fmt.Println(err)
			return echo.ErrInternalServerError
		}
	}

	// db.getCollection("minitasks").find({_id: {$gt: ObjectId("5d9b6ff5fe6e2b038fe5a409") }}).limit(1)

	// nextMiniTask.Timestamp = time.Now()
	// if err = db.DB(config.NameDb).C("minitasks").
	// 	Find(
	// 		bson.M{
	// 			"_id": bson.M{
	// 				"$gt": bson.ObjectIdHex(bodyUC.MiniTaskID),
	// 			},
	// 			"del": bson.M{"$ne": true},
	// 		},
	// 	).
	// 	Select(bson.M{"_id": 1}).
	// 	Limit(1).
	// 	One(&nextMiniTask); err != nil {
	// }

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

	fmt.Println("[ucLocationC]")
	fmt.Println(ucLocationC)

	if ucLocationC != -1 {

		uc.CourseInfo[ucLocationC].CourseName = course.CourseName
		uc.CourseInfo[ucLocationC].BackgroundImage = course.BackgroundImage
		uc.CourseInfo[ucLocationC].TotalTasksCount = course.TotalMinitask // len(taskf.Minitasks)
		completedTasksCount := uc.CourseInfo[ucLocationC].CompletedTasksCount
		if uMiniTaskLocationC == -1 {
			completedTasksCount = uc.CourseInfo[ucLocationC].CompletedTasksCount + 1
		}
		if uc.CourseInfo[ucLocationC].TotalTasksCount <= completedTasksCount {
			uc.CourseInfo[ucLocationC].ToDoTasksCount = 0
			uc.CourseInfo[ucLocationC].CompletedTasksCount = uc.CourseInfo[ucLocationC].TotalTasksCount
			uc.CourseInfo[ucLocationC].PassCourse = true
		} else {
			uc.CourseInfo[ucLocationC].ToDoTasksCount = uc.CourseInfo[ucLocationC].TotalTasksCount - completedTasksCount
			uc.CourseInfo[ucLocationC].CompletedTasksCount = completedTasksCount
			uc.CourseInfo[ucLocationC].PassCourse = false
		}

	} else {
		courseInfo := &model.CourseInfo{}

		courseInfo.CourseID = course_id
		courseInfo.CourseName = course.CourseName
		courseInfo.BackgroundImage = course.BackgroundImage
		courseInfo.TotalTasksCount = course.TotalMinitask // len(taskf.Minitasks)
		if uMiniTaskLocationC == -1 {
			courseInfo.CompletedTasksCount += 1
		}

		completedTasksCount := courseInfo.CompletedTasksCount
		if courseInfo.TotalTasksCount <= completedTasksCount {
			courseInfo.ToDoTasksCount = 0
			courseInfo.CompletedTasksCount = courseInfo.TotalTasksCount
			courseInfo.PassCourse = true

		} else {
			courseInfo.ToDoTasksCount = courseInfo.TotalTasksCount - completedTasksCount
			courseInfo.CompletedTasksCount = completedTasksCount
			courseInfo.PassCourse = false
		}

		uc.CourseInfo = append(uc.CourseInfo, courseInfo)
		// uc.CourseInfo.add(courseInfo)
	}

	fmt.Println("[isInDB]")
	fmt.Println(isInDB)
	fmt.Println(uc)

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

	} else {
		uc.ID = bson.NewObjectId()
		// Save in database
		uc.Timestamp = time.Now()
		if err = db.DB(config.NameDb).C("user_course").Insert(uc); err != nil {
			fmt.Println("[err]")
			fmt.Println(err)
			return echo.ErrInternalServerError
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
