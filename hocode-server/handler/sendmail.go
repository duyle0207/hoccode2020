package handler

import (
	"fmt"
	model "github.com/duyle0207/hoccode2020/models"
	"net/http"
	"net/smtp"

	"bytes"
	"html/template"
	"log"

	"github.com/labstack/echo"
)

// send mail - html
type Request struct {
	from    string
	to      []string
	subject string
	body    string
}

const (
	MIME = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
)

func NewRequest(to []string, subject string) *Request {
	return &Request{
		to:      to,
		subject: subject,
	}
}

func (r *Request) parseTemplate(fileName string, data interface{}) error {
	t, err := template.ParseFiles(fileName)
	if err != nil {
		return err
	}
	buffer := new(bytes.Buffer)
	if err = t.Execute(buffer, data); err != nil {
		return err
	}
	r.body = buffer.String()
	return nil
}

func (r *Request) sendMail() bool {
	body := "To: " + r.to[0] + "\r\nSubject: " + r.subject + "\r\n" + MIME + "\r\n" + r.body
	// Sender data.
	from := "nguyenquanghien2010@gmail.com"
	password := "matkhau01"

	// smtp server configuration.
	smtpServer := smtpServer{host: "smtp.gmail.com", port: "587"}

	// Authentication.
	auth := smtp.PlainAuth("", from, password, smtpServer.host)
	if err := smtp.SendMail(smtpServer.Address(), auth,
		"smtp.gmail.com", r.to, []byte(body)); err != nil {
		return false
	}
	return true
}

func (h *Handler) Send(c echo.Context) (err error) {

	email_info := &model.InviteUserInfo{}

	if err = c.Bind(email_info); err != nil {
		return
	}

	subject := "Hocode: Thư mời tham gia cuộc thi"
	r := NewRequest([]string{email_info.User}, subject)

	errr := r.parseTemplate("C:/Users/ACER/go/src/KLTN/hoccode2020/hoccode2020/hocode-server/mail_template/email.html",
		map[string]string{"host": email_info.Host, "username": email_info.User, "link":email_info.Link})

	if errr != nil {
		fmt.Println("file error")
		log.Fatal(err)
	}
	if ok := r.sendMail(); ok {
		log.Printf("Email has been sent to %s\n", r.to)
		return c.JSON(http.StatusOK, "success")
	} else {
		log.Printf("Failed to send the email to %s\n", r.to)
		return c.JSON(http.StatusBadRequest,"failed")
	}
}

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
