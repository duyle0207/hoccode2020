package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/duyle0207/hoccode2020/config"

	"github.com/dgrijalva/jwt-go"
	model "github.com/duyle0207/hoccode2020/models"
	"github.com/labstack/echo"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Get Fight list via Fight Type
func (h *Handler) GetFightListViaType(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	fight_type := c.Param("type")
	page, _ := strconv.Atoi(c.Param("page"))

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	fmt.Println(fight_type)

	fights := []*model.Fight{}

	_ = db.DB(config.NameDb).C("fights").Find(bson.M{
		"fight_type": fight_type,
	}).Skip(page * 4).Limit(4).All(&fights)

	for i := range fights {
		fight_user := &model.FightUser{}
		_ = db.DB(config.NameDb).C("fight_user").Find(bson.M{
			"user_id":  userID,
			"fight_id": fights[i].ID.Hex(),
		}).One(&fight_user)
		fmt.Println(fight_user.ID)
		fights[i].IsUserRegister = fight_user.ID != ""
	}

	return c.JSON(http.StatusOK, fights)
}

// Get Private Fight
func (h *Handler) GetPrivateFight(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	fight_user := []*model.FightUser{}

	fights := []*model.Fight{}

	_ = db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id": userID,
	}).All(&fight_user)

	_ = db.DB(config.NameDb).C("fights").Find(bson.M{}).All(&fights)

	result := []*model.Fight{}

	for i := range fight_user {
		for j := range fights {
			if fights[j].ID.Hex() == fight_user[i].FightID && fights[j].Fight_Type == "private" {
				fights[j].IsUserRegister = true
				result = append(result, fights[j])
			}
		}
	}

	return c.JSON(http.StatusOK, result)
}

// Join Fight
func (h *Handler) JoinFight_1(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	fight_id := c.Param("fight_id")
	userID := c.Param("user_id")
	email := c.Param("email")

	fight_user := &model.FightUser{
		ID:           bson.NewObjectId(),
		FightID:      fight_id,
		UserID:       userID,
		Point:        0,
		Tried:        0,
		FinishedTime: "",
	}

	isUserJoin, _ := db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id":  userID,
		"fight_id": fight_id,
	}).Count()

	if isUserJoin == 0 {
		_, err = db.DB(config.NameDb).C("fight_user").UpsertId(fight_user.ID, fight_user)
		if err != nil {
			return c.JSON(http.StatusOK, err)
		}
	}

	user_rank := &model.FightUserRank{
		ID:           bson.ObjectIdHex(userID),
		Rank:         0,
		Email:        email,
		Point:        0,
		Tried:        0,
		FinishedTime: "",
	}

	return c.JSON(http.StatusOK, user_rank)
}

func (h *Handler) JoinFight(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	fight_id := c.Param("fight_id")

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	fight_user := &model.FightUser{
		ID:           bson.NewObjectId(),
		FightID:      fight_id,
		UserID:       userID,
		Point:        0,
		Tried:        0,
		FinishedTime: "",
	}

	isUserJoin, _ := db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id":  userID,
		"fight_id": fight_id,
	}).Count()

	if isUserJoin == 0 {
		_, err = db.DB(config.NameDb).C("fight_user").UpsertId(fight_user.ID, fight_user)
		if err != nil {
			return c.JSON(http.StatusOK, err)
		}
	}

	user_rank := &model.FightUserRank{
		ID:           bson.ObjectIdHex(userID),
		Rank:         0,
		Email:        claims["name"].(string),
		Point:        0,
		Tried:        0,
		FinishedTime: "",
	}

	return c.JSON(http.StatusOK, user_rank)
}

// Get fight via User
func (h *Handler) GetFightViaUser(c echo.Context) error {

	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	email := claims["name"].(string)
	fmt.Println(email)

	fights := []*model.Fight{}

	_ = db.DB(config.NameDb).C("fights").Find(bson.M{
		"user_created": email,
		"fight_type":   "private",
	}).All(&fights)

	return c.JSON(http.StatusOK, fights)
}

// Kick User out of Fight
func (h *Handler) HandleKickUserOutFight(c echo.Context) (err error) {
	db := h.DB.Clone()
	defer db.Close()

	user_id := c.Param("user_id")
	fight_id := c.Param("fight_id")

	if err = db.DB(config.NameDb).C("fight_user").Remove(bson.M{
		"user_id":  user_id,
		"fight_id": fight_id,
	}); err != nil {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}
	}

	return c.JSON(http.StatusOK, "ok")
}

// Is user joint course
func (h *Handler) IsUserJoinFight(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	id := claims["id"].(string)

	fight_id := c.Param("fight_id")

	count, _ := db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id":  id,
		"fight_id": fight_id,
	}).Count()

	return c.JSON(http.StatusOK, count > 0)
}

// Get User's fight info
func (h *Handler) GetUserFightInfo(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	id := claims["id"].(string)

	public_fights := []*model.Fight{}
	_ = db.DB(config.NameDb).C("fights").Find(bson.M{
		"fight_type": "public",
	}).All(&public_fights)

	private_fights := []*model.Fight{}
	_ = db.DB(config.NameDb).C("fights").Find(bson.M{
		"fight_type": "private",
	}).All(&private_fights)

	fight_user := []*model.FightUser{}
	_ = db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id": id,
	}).All(&fight_user)

	total_joined_public_fight := 0
	total_joined_private_fight := 0
	for i := range fight_user {
		for a := range private_fights {
			if bson.ObjectIdHex(fight_user[i].FightID) == private_fights[a].ID {
				total_joined_private_fight++
				break
			}
		}
		for b := range public_fights {
			if bson.ObjectIdHex(fight_user[i].FightID) == public_fights[b].ID {
				total_joined_public_fight++
				break
			}
		}
	}

	result := &model.FightUserInfo{
		TotalPublicFight:        len(public_fights),
		TotalPrivateFight:       len(private_fights),
		TotalJoinedPublicFight:  total_joined_public_fight,
		TotalJoinedPrivateFight: total_joined_private_fight,
		UserId:                  id,
	}

	return c.JSON(http.StatusOK, result)
}

// Get 2 newest fight
func (h *Handler) Get2NewestFights(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	fights := []*model.Fight{}
	_ = db.DB(config.NameDb).C("fights").Find(bson.M{
		"fight_type": "public",
	}).Limit(2).Sort("-timestamp").All(&fights)

	for i := range fights {
		fights[i].Numbers_std, _ = db.DB(config.NameDb).C("fight_user").Find(bson.M{
			"fight_id": fights[i].ID.Hex(),
		}).Count()
	}

	return c.JSON(http.StatusOK, fights)
}

// Get user joining fight
func (h *Handler) GetUserJoiningFight(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	fight_id := c.Param("fight_id")

	fight_user := []*model.FightUser{}

	_ = db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"fight_id": fight_id,
	}).All(&fight_user)

	users := []*model.FightUserRank{}

	for i := range fight_user {
		user := &model.User{}
		db.DB(config.NameDb).C("users").Find(bson.M{
			"_id": bson.ObjectIdHex(fight_user[i].UserID),
		}).One(&user)

		user_rank := &model.FightUserRank{
			ID:           user.ID,
			Rank:         0,
			Email:        user.Email,
			Point:        fight_user[i].Point,
			Tried:        fight_user[i].Tried,
			FinishedTime: fight_user[i].FinishedTime,
		}

		users = append(users, user_rank)
	}

	return c.JSON(http.StatusOK, users)
}

// Get user fight
func (h *Handler) GetUserFight(c echo.Context) error {
	db := h.DB.Clone()
	defer db.Close()

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	fight_user := []*model.FightUser{}

	db.DB(config.NameDb).C("fight_user").Find(bson.M{
		"user_id": userID,
	}).All(&fight_user)

	result := []*model.Fight{}
	for i := range fight_user {
		fight := &model.Fight{}
		db.DB(config.NameDb).C("fights").Find(bson.M{
			"_id": bson.ObjectIdHex(fight_user[i].FightID),
		}).One(&fight)
		fight.IsUserRegister = true

		result = append(result, fight)
	}

	return c.JSON(http.StatusOK, result)
}

// Add code point for user fight
func (h *Handler) AddCodePointForUser(c echo.Context) (err error) {

	bk := &model.FightUser{}

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

	_, errUs := db.DB(config.NameDb).C("fight_user").UpsertId(bk.ID, bk)
	if errUs != nil {
		// return echo.ErrInternalServerError
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: errUs}
	}

	return c.JSON(http.StatusOK, bk)
}

//get fight user by fightID and userID
func (h *Handler) GetOneFightUser(c echo.Context) (err error) {
	bk := &model.FightUser{}

	fight_id := c.Param("fight_id")
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	db := h.DB.Clone()
	defer db.Close()
	if err = db.DB(config.NameDb).C("fight_user").
		// FindId(bson.ObjectIdHex(id)).
		Find(bson.M{
			"fight_id": fight_id,
			"user_id":  userID,
		}).
		One(&bk); err != nil {
		if err == mgo.ErrNotFound {
			// return echo.ErrNotFound
			return &echo.HTTPError{Code: http.StatusBadRequest, Message: err}

		}

		return
	}

	return c.JSON(http.StatusOK, bk)
}
