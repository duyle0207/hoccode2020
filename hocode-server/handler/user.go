package handler

import (
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/duyle0207/hoccode2020/config"

	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

func (h *Handler) SaveUser(c echo.Context) (err error) {

	return c.String(http.StatusOK, "saveUser")

}

// GetUser godoc
// @Summary List users
// @Description get users
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {array} model.User
// @Router /users [get]
func (h *Handler) GetUser(c echo.Context) (err error) {

	courses := []*model.User{}
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("users").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		Skip((page - 1) * limit).
		Limit(limit).
		Sort("-timestamp").
		All(&courses); err != nil {
		return
	}

	return c.JSON(http.StatusOK, courses)

}

// GetUserByID godoc
// @Summary Get user by ID
// @Description get accounts by ID
// @Tags users
// @Accept  json
// @Produce  json
// @Param  id path int true "Account ID"
// @Param  account body model.User true "Get account"
// @Success 200 {object} model.User
// @Router /users/{id} [post]
func (h *Handler) GetUserByID(c echo.Context) (err error) {
	return c.String(http.StatusOK, "GetUserByID")
}

// UpdateUser godoc
// @Summary Update user
// @Description update accounts by ID
// @Tags users
// @Accept  json
// @Produce  json
// @Param  id path int true "Account ID"
// @Param  account body model.User true "Update account"
// @Success 200 {object} model.User
// @Router /users/{id} [post]
func (h *Handler) UpdateUser(c echo.Context) (err error) {
	return c.String(http.StatusOK, "updateUser")
}

// DeleteUser godoc
// @Summary Delete user
// @Description delete accounts by ID
// @Tags users
// @Accept  json
// @Produce  json
// @Param  id path int true "Account ID"
// @Success 200 {string} string "Ok"
// @Router /users/{id} [delete]
func (h *Handler) DeleteUser(c echo.Context) (err error) {
	return c.String(http.StatusOK, "deleteUser")
}

func (h *Handler) GetGeneralLeaderBoard(c echo.Context) (err error){
	db := h.DB.Clone()
	defer db.Close()

	general_leaderboard := []*model.User{}
	db.DB(config.NameDb).C("users").Find(bson.M{}).Skip(0).Limit(10).Sort("-codepoint").All(&general_leaderboard)

	return c.JSON(http.StatusOK, general_leaderboard)
}

func (h *Handler) GetCourseLeaderBoard(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	course_id := c.Param("course_id")

	user_course_leaderboard := []*model.UserCourseLeaderBoard{}

	user_course := []*model.UserCourse{}
	_ = db.DB(config.NameDb).C("user_course").Find(bson.M{}).All(&user_course)

	for i := range user_course {
		for j := range user_course[i].CourseInfo {
			if(user_course[i].CourseInfo[j].CourseID == course_id) {
				u := &model.UserCourseLeaderBoard{
					UserInfo:  GetUserByID(h, user_course[i].UserID),
					CourseID:  course_id,
					UserPoint: user_course[i].CourseInfo[j].CodePoint,
					IsCurrentAccount: userID == user_course[i].UserID,
				}
				user_course_leaderboard = append(user_course_leaderboard, u)
			}
		}
	}

	sort.Slice(user_course_leaderboard, func(i, j int) bool {
		return user_course_leaderboard[i].UserPoint > user_course_leaderboard[j].UserPoint
	})

	if len(user_course_leaderboard) >= 10 {
		user_course_leaderboard = user_course_leaderboard[:10]
	}

	return c.JSON(http.StatusOK, user_course_leaderboard)
}

func GetUserByID(h *Handler, user_id string) model.User {
	db := h.DB.Clone()
	defer db.Close()

    user := model.User{}
    db.DB(config.NameDb).C("users").Find(bson.M{
		"_id": bson.ObjectIdHex(user_id),
	}).One(&user)

    return user
}

func (h *Handler) AddMinitaskToFavouriteList(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	minitask_id := c.Param("minitask_id")

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	user_minitask_favourite_temp := &model.UserMinitaskFavourite{}

	db.DB(config.NameDb).C("user_minitask_favourite").Find(bson.M{
		"user_id": userID,
		"minitask_id": minitask_id,
	}).One(&user_minitask_favourite_temp)

	if user_minitask_favourite_temp.ID == "" {
		user_minitask_favourite_temp.ID = bson.NewObjectId()
		user_minitask_favourite_temp.UserID = userID
		user_minitask_favourite_temp.MiniTaskID = minitask_id
		user_minitask_favourite_temp.Timestamp = time.Now()

		db.DB(config.NameDb).C("user_minitask_favourite").UpsertId(user_minitask_favourite_temp.ID, user_minitask_favourite_temp)
	} else {
		db.DB(config.NameDb).C("user_minitask_favourite").RemoveId(user_minitask_favourite_temp.ID)
	}

	return c.JSON(http.StatusOK, user_minitask_favourite_temp)
}

func (h *Handler) CheckUserLikeMinitask(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	user_minitask_favourite := &model.UserMinitaskFavourite{}

	minitask_id := c.Param("minitask_id")

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db.DB(config.NameDb).C("user_minitask_favourite").Find(bson.M{
		"user_id": userID,
		"minitask_id": minitask_id,
	}).One(&user_minitask_favourite)

	return c.JSON(http.StatusOK, user_minitask_favourite)
}

func (h *Handler) GetUserMinitaskFavourite(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	user_minitask_favourite := []*model.UserMinitaskFavourite{}
	db.DB(config.NameDb).C("user_minitask_favourite").Find(bson.M{
		"user_id": userID,
	}).All(&user_minitask_favourite)

	minitask_list := []*model.MiniTask{}

	for i:=range  user_minitask_favourite {
		minitask := &model.MiniTask{}

		user_minitask_practice_temp := &model.UserMinitaskPractice{}

		db.DB(config.NameDb).C("user_minitask_practice").Find(bson.M{
			"user_id":     userID,
			"minitask_id": user_minitask_favourite[i].MiniTaskID,
		}).One(&user_minitask_practice_temp)

		db.DB(config.NameDb).C("minitasks").Find(bson.M{
			"_id": bson.ObjectIdHex(user_minitask_favourite[i].MiniTaskID),
		}).One(&minitask)

		if user_minitask_practice_temp != nil {
			minitask.Status = user_minitask_practice_temp.Status
		}

		minitask_list = append(minitask_list, minitask)
	}

	return c.JSON(http.StatusOK, minitask_list)
}

// Search User
func (h *Handler) SearchUser(c echo.Context) (err error) {

	db := h.DB.Clone()
	defer db.Close()

	email := c.Param("email")

	users :=[]*model.User{}

	db.DB(config.NameDb).C("users").Find(bson.M{
		"email": bson.RegEx{email, "i"},
	}).Limit(8).All(&users)

	return c.JSON(http.StatusOK, users)
}