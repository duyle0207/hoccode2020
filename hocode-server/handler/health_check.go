package handler

import (
	"fmt"
	"github.com/duyle0207/hoccode2020/config"
	model "github.com/duyle0207/hoccode2020/models"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
)

// HealthCheck godoc
// @Summary Health Check Server
// @Description Health Check Server
// @Accept  json
// @Produce  json
// @Success 200 {string} string "Server Ok"
// @Router /health_check [get]
func (h *Handler) HealthCheck(c echo.Context) (err error) {

	courses := []*model.User{}
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	db := h.DB.Clone()
	fmt.Println(db)
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
