package handler

import (
	"net/http"

	// "github.com/dgrijalva/jwt-go"

	"github.com/dgrijalva/jwt-go"
	"github.com/duyle0207/hoccode2020/config"

	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2/bson"
)

func (h *Handler) UpdateFightUserMinitask(c echo.Context) (err error) {
	bk := &model.FightUserMinitask{
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

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	_, errUs := db.DB(config.NameDb).C("fight_user_minitask").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)
}

func (h *Handler) CreateFightUserMinitask(c echo.Context) (err error) {

	bk := &model.FightUserMinitask{
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
	// if err = db.DB(config.NameDb).C("tasks").Insert(bk); err != nil {
	// 	return echo.ErrInternalServerError
	// }

	_, errUs := db.DB(config.NameDb).C("fight_user_minitask").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)

}

// get one fight minitask user
func (h *Handler) GetOneMinitaskFight(c echo.Context) (err error) {

	bk := &model.FightUserMinitask{}

	fightID := c.Param("fightid")
	minitaskId := c.Param("miid")
	// userID := c.Param("id")
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Clone()

	db.DB(config.NameDb).C("fight_user_minitask").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"fight_id":    fightID,
			"user_id":     userID,
			"minitask_id": minitaskId,
		}).One(&bk)
	return c.JSON(http.StatusOK, bk)

}

// get all fight minitask user
func (h *Handler) GetAllDoneMinitaskFight(c echo.Context) (err error) {

	bk := []*model.FightUserMinitask{}

	fightID := c.Param("fightid")
	// userID := c.Param("id")
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Clone()

	db.DB(config.NameDb).C("fight_user_minitask").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"fight_id": fightID,
			"user_id":  userID,
			"status":   "done",
		}).All(&bk)
	return c.JSON(http.StatusOK, bk)

}
