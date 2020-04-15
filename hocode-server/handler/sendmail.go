package handler

import (
	"fmt"
	"net/http"
	"net/smtp"

	"github.com/labstack/echo"
)

// smtpServer data to smtp server
type smtpServer struct {
	host string
	port string
}

type Email struct {
	Message []byte
	To      []string
}

// Address URI to smtp server
func (s *smtpServer) Address() string {
	return s.host + ":" + s.port
}

func (h *Handler) SendEmail(c echo.Context) (err error) {
	e := new(Email)

	if err = c.Bind(e); err != nil {
		fmt.Println(err)
		return
	}
	// Sender data.
	from := "nguyenquanghien2010@gmail.com"
	password := "matkhau01"

	// smtp server configuration.
	smtpServer := smtpServer{host: "smtp.gmail.com", port: "587"}

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpServer.host)

	// Sending email.
	err = smtp.SendMail(smtpServer.Address(), auth, from, e.To, e.Message)

	return c.JSON(http.StatusOK, e)
}
