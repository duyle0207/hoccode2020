import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LaptopIcon from "@material-ui/icons/Laptop";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import React, { Component } from "react";
import { matchPath } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { randomColor } from "../course/CourseItem";
import TaskItem from "./TaskItem";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { connect } from "react-redux";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import EmojiNatureIcon from "@material-ui/icons/EmojiNature";

import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Fade from '@material-ui/core/Fade';
import CourseLeaderBoard from '../courseLeaderBoard/CourseLeaderBoard';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      p={1}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Fade in={!(value !== index)} {...(true ? { timeout: 1000 } : {})}>{children}</Fade>}
    </Box>
  );
}

const styles = {
  card: {
    height: 150,
    width: "100%"
  },

  TasksContainer: {
    // paddingTop: 30,

    // minHeight: "87vh"
  }
};
const getParams = pathname => {
  const course = matchPath(pathname, {
    path: `/profile/courses/:courseId/tasks`
  });
  return (course && course.params) || {};
};
class TaskBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isLoading: true,
      course: {},
      courseId: "",
      totalMinitask: 0,
      coursPassInfo: {},
      courseStatus: '',
      userCourse: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      value: 0,
      // value to check show form reasons
      showForm: false,
      reason: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ reason: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ showForm: false });

    let location = this.props.location;
    const currentParams = getParams(location.pathname);

    var newcourse = this.state.course;
    newcourse.status = "Pedding";
    // console.log(newcourse);
    this.setState({ course: newcourse });

    axios
      .put(
        `http://localhost:8081/api/v1/curd/courses/${currentParams.courseId}`,
        newcourse
      )
      .then(res => {
        // const course = res.data;
        // this.setState({ course: course });
      });

    // get course name 
    var nameCourse = this.state.course.course_name;
    // eslint-disable-next-line no-useless-concat
    let msg_deny = "Subject: Thông báo từ Hocode\r\n" + "Khóa học " + nameCourse + " của bạn không được ban quản trị xét duyệt.\r\n"
    let reasonsText = "Lí do: " + this.state.reason
    var content = msg_deny + reasonsText
    console.log(msg_deny)
    this.handleSendEmail(content)

    alert('Thông báo đã gửi đi !');
    event.preventDefault();
  }
  componentWillUnmount() {
    this.stop();
  }

  handleChangeValue = (event, newValue) => {
    this.setState({ value: newValue });
  }

  componentDidMount() {
    let location = this.props.location; // cant use this.props.match to get param in url, => pass 'location' from profile page and use matchparam to get param

    const currentParams = getParams(location.pathname);
    console.log(currentParams);

    this.setState({ courseId: currentParams.courseId });

    axios.get(`http://localhost:8081/api/v1/curd/getCoursePassInfo/${currentParams.courseId}`).then(res => {
      console.log("[CoursePass]")
      this.setState({ coursPassInfo: res.data, courseId: currentParams.courseId });
      console.log(res.data);
    });

    axios.get(`http://localhost:8081/api/v1/totalMinitask/${currentParams.courseId}`).then(res => {
      this.setState({ totalMinitask: res.data })
    });

    axios.get(`http://localhost:8081/api/v1/auth/usercourse`).then(res => {
      var isFound = false;
      for (var i = 0; i < res.data.course_info.length; i++) {
        if (res.data.course_info[i].course_id === currentParams.courseId) {
          isFound = true;
        }
        if (isFound) {
          this.setState({ userCourse: res.data.course_info[i].code_point });
          break;
        }
      }
      if (!isFound) {
        this.setState({ userCourse: 0 });
      }
      console.log(this.state.userCourse);
    });

    axios
      .get(
        `http://localhost:8081/api/v1/auth/courses/${currentParams.courseId}/tasks`
      )
      .then(res => {
        console.log(res.data);
        const tasks = res.data;
        let tasks1 = tasks.reverse();
        this.setState({ tasks: tasks1, isLoading: false });
      });



    axios
      .get(`http://localhost:8081/api/v1/courses/${currentParams.courseId}`)
      .then(res => {
        console.log(res.data);
        const course = res.data;
        var code;
        if ((new Date() < new Date(course.start_time))) {
          code = -1;
        }
        if ((new Date() > new Date(course.start_time)) && (new Date() < new Date(course.end_time))) {
          code = 0;
        }
        if ((new Date() > new Date(course.end_time))) {
          code = 1;
        }
        this.setState({ course: course, courseStatus: code });
      });

    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.state.courseStatus === -1 ? this.state.course.start_time : this.state.course.end_time);
      date ? this.setState(date) : this.stop();
    }, 1000);

    /* setTimeout(()=>{
            console.log(this.state.tasks)
        },2000)*/

  }

  onClickRating(val) {
    let location = this.props.location;

    const currentParams = getParams(location.pathname);

    var newcourse = this.state.course;
    if (newcourse.rating === null) newcourse.rating = [];
    newcourse.rating.push(val);
    newcourse.rating_value = average(newcourse.rating);
    // console.log(newcourse);
    this.setState({ course: newcourse });

    axios
      .put(
        `http://localhost:8081/api/v1/curd/courses/${currentParams.courseId}`,
        newcourse
      )
      .then(res => {
        // const course = res.data;
        // this.setState({ course: course });
      });
  }

  calculateCountdown(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) { // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) { // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;

    return timeLeft;
  }

  stop() {
    clearInterval(this.interval);
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  // covert string utf8 to bytes array
  string2Bin(str) {
    var utf8 = unescape(encodeURIComponent(str));
    var result = [];
    for (var i = 0; i < utf8.length; i++) {
      result.push(utf8.charCodeAt(i));
    }
    return result;
  }


  // handle send email after click buttons. 
  handleSendEmail(msg) {
    var to_mail = []
    // to_mail.push("nqhien026@gmail.com")
    // to_mail.push("16110070@student.hcmute.edu.vn")
    to_mail.push(this.state.course.user_create)
    var Message = this.string2Bin(msg)
    var mail = {}
    mail["Message"] = Message
    mail["To"] = to_mail
    console.log(mail)
    axios
      .post(
        `http://localhost:8081/api/v1/sendmail`,
        mail
      )
      .then(response => {

      });
  }

  handleBtnAccepted() {
    let location = this.props.location;

    const currentParams = getParams(location.pathname);

    var newcourse = this.state.course;
    newcourse.status = "Active";
    // console.log(newcourse);
    this.setState({ course: newcourse });

    axios
      .put(
        `http://localhost:8081/api/v1/curd/courses/${currentParams.courseId}`,
        newcourse
      )
      .then(res => {
        // const course = res.data;
        // this.setState({ course: course });
      });

    // get course name 
    var nameCourse = this.state.course.course_name;
    let msg_accept = "Khóa học" + nameCourse + " của bạn đã được ban quản trị xét duyệt thành công"
    console.log(msg_accept)
    this.handleSendEmail(msg_accept)
  }

  handleBtnDeny() {
    this.setState({ showForm: true })

  }

  // show alert 
  showAlert() {
    alert("Thông tin kiểm duyệt đã gửi cho người tạo khóa học !")
  }

  handleCancel() {
    this.setState({ showForm: false })
  }
  // show form reasons 
  showFormReasons = () => {
    return (
      <div style={{ borderRadius: "5px", backgroundColor: "#f2f2f2", padding: "20px", margin: "0 auto" }} className="container">
        <form onSubmit={this.handleSubmit}>
          <label>Góp ý:</label>
          <textarea
            style={{
              height: 200,
              width: "100%", padding: "12px",
              border: "1px solid #ccc",
              borderTopLeftRadius: 4,
              boxSizing: "border-box",
              marginTop: 6,
              marginBottom: 16,
              resize: "vertical"
            }} id="reasons" name="reasons" value={this.state.reason} onChange={this.handleChange} />
          <input
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "12px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: PointerEvent,
            }}
            type="submit" value="Submit" placeholder="Ý kiến góp ý..." />
          <button style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "12px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: PointerEvent,
            position: "relative", marginLeft: "10px"
          }} onClick={() => this.handleCancel()} >Cancel</button>
        </form>
      </div>
    );
  }
  render() {
    const { classes } = this.props;
    const { tasks, course, courseStatus, value, days, hours, min, sec } = this.state;
    const { isLoading } = this.state;
    let courseLoop;
    if (courseStatus === -1) {
      if (this.props.user.role === "admin" || this.props.user.role === "mod") {
        courseLoop = tasks.map(task => (
          <TaskItem key={task.id} task={task} courseId={this.state.courseId} />
        ))
      }
      else {
        courseLoop =
          <React.Fragment>
            <Box justifyContent="center">
              <Typography align="center" variant="h3">
                Course hiện tại chưa được mở vui lòng quay lại vào {new Date(course.start_time)
                .toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                        .replace(/T/, ' ').replace(/\..+/, '')} nhé! <InsertEmoticonIcon />
              </Typography>
            </Box>
          </React.Fragment>
      }
    }
    else {
      courseLoop = tasks.map(task => (
        <TaskItem key={task.id} task={task} courseId={this.state.courseId} />
      ))
    }

    let timer;
    if (courseStatus === 0) {
      timer = <React.Fragment>
        <Box display="flex" flexGrow={1} color="#ef5350">
          <Typography variant="button" display="block" gutterBottom>
            Đang diển ra
          </Typography>
        </Box>
        <Box display="flex" color="#f44336">
          <Box order={4}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(sec) + ' giây '}&nbsp;
            </Typography>
          </Box>
          <Box order={3}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(min) + ' phút '}&nbsp;
            </Typography>
          </Box>
          <Box order={2}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(hours) + ' giờ '}&nbsp;
            </Typography>
          </Box>
          <Box order={1}>
            <Typography variant="button" display="block" gutterBottom>
              Còn lại &nbsp;{this.addLeadingZeros(days) + ' ngày '}&nbsp;
            </Typography>
          </Box>
        </Box>
      </React.Fragment>
    } else if (courseStatus === -1) {
      timer = <React.Fragment>
        <Box display="flex" color="#212121">
          <Typography variant="button" display="block" gutterBottom>
            Sắp diển ra
          </Typography>
        </Box>
        <Box mb={1} display="flex" color="#4caf50">
          <Box order={4}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(sec) + ' giây '}&nbsp;
            </Typography>
          </Box>
          <Box order={3}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(min) + ' phút '}&nbsp;
            </Typography>
          </Box>
          <Box order={2}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(hours) + ' giờ '}&nbsp;
            </Typography>
          </Box>
          <Box order={1}>
            <Typography variant="button" display="block" gutterBottom>
              {this.addLeadingZeros(days) + ' ngày '}&nbsp;
            </Typography>
          </Box>
        </Box>
      </React.Fragment>
    } else if (courseStatus === 1) {
      timer = <React.Fragment>
        <Box display="flex">
          <Typography variant="h5" display="block" gutterBottom>
            Tình trạng: &nbsp;
          </Typography>
          <Typography variant="h5" color="#757575" display="block" gutterBottom>
            Kết thúc
          </Typography>
        </Box>
        <Box mb={1} display="flex" color="#757575">
          <Typography variant="button" display="block" gutterBottom>
            {new Date(course.end_time).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
          </Typography>
        </Box>
      </React.Fragment>
    }

    return (
      <Grid container className={classes.TasksContainer} justify="center">
        {/* <Card className={classes.card}>
</Card> */}
        {isLoading ? (
          <div
            className="sweet-loading"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100vh"
            }}
          >
            <HashLoader
              sizeUnit={"px"}
              size={50}
              color={"#AEA8A8"}
              loading={isLoading}
            />
          </div>
        ) : (
            <React.Fragment>
              <Grid item xs={12} sm={12} style={{ marginBottom: 0 }}>
                <Paper >
                  <Grid container style={{ padding: 20 }} spacing={2}>
                    <Grid item xs={4} sm={4}>
                      <Card>
                        <CardMedia
                          style={{ height: 120, borderRadius: 8 }}
                          image={this.state.course.background_image}
                          title="Contemplative Reptile"
                        />
                        <CardContent>
                          {timer}
                          <Box display="flex" color="#5c6bc0" justifyContent="flex-end">
                            <Typography variant="h5">
                              {this.state.userCourse ? this.state.userCourse : 0} <EmojiNatureIcon />
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={8} sm={8}>
                      <Box display="flex">
                        <Box flexGrow={1} mt={1} mb={2}>
                          <Typography variant="h3" component="h3" style={{fontWeight: 400}}>
                            {course.course_name}
                          </Typography>
                        </Box>
                        <Box mt={3} mb={2}>
                          {course.status === "Active" ? null : (
                            <Box display="flex">
                              <Box p={1}>
                                <Button size="small"
                                  variant="contained"
                                  aria-label="small outlined button group"
                                  color="primary"
                                  onClick={
                                    () => { this.handleBtnAccepted(); this.showAlert(); }
                                  }>
                                  Duyệt khóa học
                                </Button>
                              </Box>
                              <Box p={1}>
                                <Button size="small"
                                  variant="contained"
                                  aria-label="small outlined button group"
                                  color="secondary"
                                  onClick={
                                    () => { this.handleBtnDeny() }
                                  }>
                                  Góp ý
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        container
                        style={{ justifyContent: "space-between" }}
                      >
                        <Grid
                          item
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Avatar
                            className={classes.smallAvatar}
                            style={{ backgroundColor: randomColor() }}
                          >
                            {" "}
                            {course.user_create
                              ? course.user_create.charAt(0).toUpperCase()
                              : "H"}
                          </Avatar>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                            style={{ marginLeft: 6, fontWeight: 600 }}
                          >
                            {/* {course.total_minitask} */}
                            {course.user_create !== ""
                              ? course.user_create
                              : "Hocode"}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Rating
                            name="a"
                            value={course.rating_value}
                            read-only="true"
                            precision={0.5}
                            size="large"
                            onChange={(event, newValue) => {
                              this.onClickRating(newValue);
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                            style={{ marginLeft: 4, fontWeight: 600 }}
                          >
                            {/* {course.total_minitask} */}
                            Đánh giá({course.rating ? course.rating.length : 0})
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                          }}
                        >
                          <Box display="flex">
                            <LaptopIcon fontSize="medium" />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                              style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}
                            >
                              {/* {course.total_minitask} */}
                              {this.state.totalMinitask} bài học
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} style={{ paddingTop: '15px'}}>
                          <Typography style={{fontSize: 15, color: "#757575", fontWeight: 400, lineHeight: "25.5px"}}>
                            {course.course_desc}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start"
                        }}
                      >
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid xs={12} justify="center" >
                <AppBar position="static" style={{ backgroundColor: "#FAFAFA", color: "#242424" }}>
                  <Tabs value={value} onChange={this.handleChangeValue} variant="fullWidth"
                    indicatorColor="primary"
                    aria-label="simple tabs example">
                    <Tab label="Bài tập" />
                    <Tab label="Xếp hạng" />
                  </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                  <Box display="flex" justifyContent="center" p={1} className="Hello">
                    <Grid item xs={12} sm={6} >
                      {courseLoop}
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Box display="flex" justifyContent="center" p={1} className="Hello">
                    <Grid item xs={12} sm={12} >
                      <CourseLeaderBoard courseId={this.state.courseId} />
                    </Grid>
                  </Box>
                </TabPanel>
              </Grid>
            </React.Fragment>
          )}
        {this.state.showForm ? this.showFormReasons() : null}
      </Grid>

    );
  }
}

const average = list => list.reduce((prev, curr) => prev + curr) / list.length;

const mapStateToProps = state => ({
  user: state.rootReducer.user
});

export default withStyles(styles)(connect(mapStateToProps, null)(TaskBody));
