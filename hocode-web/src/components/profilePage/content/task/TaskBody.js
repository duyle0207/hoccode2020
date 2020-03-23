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

const styles = {
  card: {
    height: 150,
    width: "100%"
  },

  TasksContainer: {
    // paddingTop: 30,

    minHeight: "100vh"
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
      userCourse: {},
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
    };
  }

  componentWillUnmount() {
    this.stop();
  }

  componentDidMount() {
    let location = this.props.location; // cant use this.props.match to get param in url, => pass 'location' from profile page and use matchparam to get param

    const currentParams = getParams(location.pathname);
    console.log(currentParams);

    axios.get(`http://localhost:8081/api/v1/curd/getCoursePassInfo/${currentParams.courseId}`).then(res => {
      console.log("[CoursePass]")
      this.setState({ coursPassInfo: res.data });
      console.log(res.data);
    });

    axios.get(`http://localhost:8081/api/v1/totalMinitask/${currentParams.courseId}`).then(res => {
      this.setState({ totalMinitask: res.data })
    });

    axios.get(`http://localhost:8081/api/v1/auth/usercourse`).then(res => {
      console.log(res.data);
      this.setState({userCourse:res.data});
    });

    this.setState({ courseId: currentParams.courseId })

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

  }

  handleBtnDeny(){
    let location = this.props.location;

    const currentParams = getParams(location.pathname);

    var newcourse = this.state.course;
    newcourse.status = "Inactive";
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

  render() {
    const { classes } = this.props;
    const { tasks, course, courseStatus, days, hours, min, sec } = this.state;
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
                Course hiện tại chưa được mở vui lòng quay lại vào {new Date(course.start_time).toISOString().replace(/T/, ' ').replace(/\..+/, '')} nhé! <InsertEmoticonIcon />
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
              <Grid item xs={12} sm={12} style={{ marginBottom: 30 }}>
                <Paper>
                  <Grid container style={{ padding: 30 }} spacing={2}>
                    <Grid item xs={4} sm={4}>
                      <Card>
                        <CardMedia
                          style={{ height: 220 }}
                          image={this.state.course.background_image}
                          title="Contemplative Reptile"
                        />
                        <CardContent>
                          {timer}
                          <Box display="flex" color="#5c6bc0" justifyContent="flex-end">
                            <Typography variant="h4">
                              {this.state.userCourse.user_point?this.state.userCourse.user_point:0} <EmojiNatureIcon />
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={7} sm={7}>
                      <Box mt={3} mb={2}>
                        <Typography variant="h3" component="h3">
                          {course.course_name}
                        </Typography>
                      </Box>
                      <Grid
                        item
                        xs={8}
                        sm={8}
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
                            style={{ marginLeft: 6 }}
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
                            style={{ marginLeft: 4 }}
                          >
                            {/* {course.total_minitask} */}
                            Đánh giá({course.rating ? course.rating.length : 0})
                          </Typography>
                        </Grid>
                        <Box display="flex" mt={1}>
                          <LaptopIcon fontSize="large" />
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            component="p"
                            style={{ marginLeft: 6 }}
                          >
                            {/* {course.total_minitask} */}
                            {this.state.totalMinitask} bài học
                            </Typography>
                        </Box>
                        <Grid item xs={12} sm={12} style={{ paddingTop: '15px' }}>
                          <Typography variant="body1">
                            {course.course_desc}
                          </Typography>
                        </Grid>
                        <Box>
                          <Typography variant="cation" display="block" gutterBottom>
                            {/* Ngày bắt đầu: {new Date(course.start_time).toISOString().replace(/T/, ' ').replace(/\..+/, '')} */}
                            Ngày bắt đầu: {course.start_time}
                          </Typography>
                          <Typography variant="cation" display="block" gutterBottom>
                            Ngày kết thúc: {course.end_time}
                          </Typography>
                        </Box>
                      </Grid>

                    <Grid
                      item
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start"
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{ marginRight: 4 }}
                      >
                        Tình trạng:
                      </Typography>
                      {/* <CircularProgress variant="determinate" value={100} />                   */}
                      {course.status === "Active" ? null: (
                        <div>
                          <Button size="small"
                                  variant="contained"
                                  aria-label="small outlined button group"
                                  color="primary"
                                  onClick= {
                                    () => this.handleBtnAccepted()
                                  }>
                                    Duyệt khóa học
                          </Button>
                          <Button size="small"
                                  variant="contained"
                                  aria-label="small outlined button group"
                                  color="secondary"
                                  onClick= {
                                    () => this.handleBtnDeny()
                                  }>
                                    Từ chối
                          </Button>
                        </div>                       
                      )}
                    </Grid> 
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} style={{ padding: "0px 10px" }}>
                {courseLoop}
              </Grid>
            </React.Fragment>
          )}
      </Grid>
    );
  }
}

const average = list => list.reduce((prev, curr) => prev + curr) / list.length;

const mapStateToProps = state => ({
  user: state.rootReducer.user
});

export default withStyles(styles)(connect(mapStateToProps, null)(TaskBody));
