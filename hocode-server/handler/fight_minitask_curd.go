package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/duyle0207/hoccode2020/config"

	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (h *Handler) CreateFightMinitask(c echo.Context) (err error) {

	bk := &model.FightMiniTask{
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

	_, errUs := db.DB(config.NameDb).C("fight_minitask").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)

}

func (h *Handler) GetListFightMinitask(c echo.Context) (err error) {

	bk := []*model.FightMiniTask{}

	// page, _ := strconv.Atoi(c.QueryParam("page"))
	offset, _ := strconv.Atoi(c.QueryParam("offset"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	defer db.Close()

	if err = db.DB(config.NameDb).C("fight_minitask").
		Find(bson.M{"del": bson.M{"$ne": true}}).
		// Skip((page - 1) * limit).
		Skip(offset).
		Limit(limit).
		All(&bk); err != nil {
		return
	}
	c.Response().Header().Set("x-total-count", strconv.Itoa(len(bk)))

	return c.JSON(http.StatusOK, bk)

}

func (h *Handler) GetListMinitaskByFightID(c echo.Context) (err error) {
	fightID := c.Param("fightid")

	db := h.DB.Clone()
	defer db.Clone()
	bk := []*model.FightMiniTask{}

	db.DB(config.NameDb).C("fight_minitask").
		Find(bson.M{
			"fight_id": fightID,
		}).All(&bk)

	miniTaskList := []*model.MiniTask{}
	for i := 0; i < len(bk); i++ {
		miniTask := &model.MiniTask{}
		db.DB(config.NameDb).C("minitasks").
			Find(
				bson.M{
					"_id": bson.ObjectIdHex(bk[i].Minitask_id),
				},
			).One(&miniTask)
		fmt.Println(miniTask.MiniTaskName)
		miniTaskList = append(miniTaskList, miniTask)
	}

	return c.JSON(http.StatusOK, miniTaskList)

}

func (h *Handler) GetOneFightMinitask(c echo.Context) (err error) {

	bk := &model.FightMiniTask{}

	id := c.Param("id")

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("fight_minitask").
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

func (h *Handler) DeleteFightMinitask(c echo.Context) (err error) {
	bk := &model.FightMiniTask{
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

	fight_id := c.Param("fight_id")
	minitask_id := c.Param("minitask_id")

	bk.Fight_id = fight_id
	bk.Minitask_id = minitask_id

	// Connect to DB
	db := h.DB.Clone()
	defer db.Close()

	bk.Del = true
	if err = db.DB(config.NameDb).C("fight_minitask").Remove(
		bson.M{
			"minitask_id": bk.Minitask_id,
			"fight_id":    bk.Fight_id,
		}); err != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}
	}

	return c.JSON(http.StatusOK, bk)
}
