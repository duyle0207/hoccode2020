package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/duyle0207/hoccode2020/config"

	"github.com/dgrijalva/jwt-go"
	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

// UserMiniTask godoc
// @Summary Get complete user minitask
// @ID user_complete_minitask
// @Description
// @Tags UserMiniTask
// @Accept  json
// @Produce  json
// @Success 200 {array} model.MiniTask
// @Router /auth/completeminitask [get]

func (h *Handler) GetListUserMinitask(c echo.Context) (err error) {
	userMinitask := []*model.MiniTask{}

	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("user_minitask").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		Sort("-timestamp").
		All(&userMinitask); err != nil {
		return
	}
	c.Response().Header().Set("x-total-count", strconv.Itoa(len(userMinitask)))

	return c.JSON(http.StatusOK, userMinitask)
}

func (h *Handler) GetUserCompleteMititask(c echo.Context) (err error) {

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Close()

	userMiniTask := &model.UserMiniTask{}

	fmt.Println("[user_minitask]")
	if err = db.DB(config.NameDb).C("user_minitask").
		Find(bson.M{
			"user_id": userID,
			"del":     bson.M{"$ne": true},
		}).
		One(&userMiniTask); err != nil {
	}

	mta := []*model.MiniTask{}

	for i := 0; i < len(userMiniTask.MiniTaskInfo); i++ {
		bk := &model.MiniTask{}

		fmt.Println("[minitasks]")
		fmt.Println(userMiniTask.MiniTaskInfo[i].MiniTaskID)
		db.DB(config.NameDb).C("minitasks").
			// FindId(bson.ObjectIdHex(id)).
			Find(bson.M{
				"_id": bson.ObjectIdHex(userMiniTask.MiniTaskInfo[i].MiniTaskID),
				"del": bson.M{"$ne": true},
			}).
			One(&bk)

		if bk != nil {
			if bk.ID != "" {
				mta = append(mta, bk)
			}
		}

	}

	for i := 0; i < len(mta); i++ {

		tf := &model.Task{}

		fmt.Println("[tasks]")
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
			// if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			// return
			// }

			return
		}
		if tf != nil {
			if tf.BackgroundImage != "" {
				mta[i].Avatar = tf.BackgroundImage
			}
		}
	}
	return c.JSON(http.StatusOK, mta)

}
