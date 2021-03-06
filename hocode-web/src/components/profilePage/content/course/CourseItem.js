// import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple, green, pink } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import LaptopIcon from "@material-ui/icons/Laptop";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import "./hover.css";
import axios from "axios";
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from "@material-ui/core/Tooltip";
import EmojiNatureIcon from "@material-ui/icons/EmojiNature";
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Link } from "react-router-dom";
import FacebookIcon from '@material-ui/icons/Facebook';

import {
  // FacebookShareCount,
  // FacebookIcon,
  FacebookShareButton
} from "react-share";
// import { Button } from "@material-ui/core";

const randomColor = () => {
  var listColor = [deepOrange[500], deepPurple[500], green[500], pink[500]];
  var color = listColor[Math.floor(Math.random() * listColor.length)];

  return color;
};

export { randomColor };

const styles = {
  courseItem: {
    borderRadius: "4px",
    boxShadow:
      "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
    overflow: "hidden",
    background: "#FFFFFF",
    cursor: "pointer"
  },
  smallAvatar: {
    height: "24px",
    width: "24px",
    marginRight: "4px",
    // backgroundColor: randomColor(),
    // fontSize: "0.8rem",
    fontSize: "1rem",
    fontWeight: "600"
  }
};
class CourseItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalMinitask: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      courseStatus: 0,
      coursePassInfo: {},
      isLoadingCourseInfo: true,
      //status for like function
      liked: true
    };
  }

  componentWillUnmount() {
    this.stop();
  }

  componentDidMount() {
    axios.get(`http://localhost:8081/api/v1/totalMinitask/${this.props.course.id}`).then(res => {
      // console.log(res.data);
      this.setState({ totalMinitask: res.data });
    });
    axios.get(`http://localhost:8081/api/v1/curd/getCoursePassInfo/${this.props.course.id}`).then(res => {
      console.log(res.data);
      this.setState({ coursePassInfo: res.data, isLoadingCourseInfo: false });
    });
    var code;
    if ((new Date() < new Date(this.props.course.start_time))) {
      code = -1;
    }
    if ((new Date() > new Date(this.props.course.start_time)) && (new Date() < new Date(this.props.course.end_time))) {
      code = 0;
    }
    if ((new Date() > new Date(this.props.course.end_time))) {
      code = 1;
    }
    this.setState({ courseStatus: code });
    this.interval = setInterval(() => {
      const date = this.calculateCountdown(code === -1 ? this.props.course.start_time : this.props.course.end_time);
      date ? this.setState(date) : this.stop();
    }, 1000);
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

  // handle func like course 

  handleCountLiked() {
    var newcourse = this.props.course;
    if (!this.state.liked) {
      this.setState((prevState, props) => {
        return {
          liked: true
        }
      });
    } else {
      this.setState((prevState, props) => {
        return {
          liked: false
        }
      });
    }
    if (this.state.liked) {
      newcourse.numbers_like = this.props.course.numbers_like + 1;
    }
    else {
      newcourse.numbers_like = this.props.course.numbers_like - 1;
    }
    this.setState({ course: newcourse });

    axios
      .put(
        `http://localhost:8081/api/v1/curd/courses/${this.props.course.id}`,
        newcourse
      )
      .then(res => {
        // const course = res.data;
        // this.setState({ course: course });
      });

    // console.log(newcourse);

  }

  renderPraceticeProgress = (page) => {
    if (page === "overview") {
      return "";
    } else {
      return <React.Fragment>
        <Box justifyContent="flex-start" p={1} display="flex" color="#757575">
          <Tooltip title={(this.state.coursePassInfo.total_minitask === 0) ? "0%" :
            (Math.round((this.state.coursePassInfo.minitask_solved / this.state.coursePassInfo.total_minitask) * 100) * 100) / 100 + "%"} placement="top">
            <Fade in={!this.state.isLoadingCourseInfo} {...(true ? { timeout: 1000 } : {})}>
              <LinearProgress
                variant="determinate"
                value={this.state.coursePassInfo.total_minitask === 0 ? "0" :
                  (this.state.coursePassInfo.minitask_solved /
                    this.state.coursePassInfo.total_minitask) * 100
                }
                style={{ width: '100%', height: 7 }}
              />
            </Fade>
          </Tooltip>
        </Box>
        <Box display="flex">
          <Box p={2} flexGrow={1} justifyContent="flex-start" color="#757575">
            <Typography variant="subtitle2" style={{ fontWeight: 10000 }}>
              {(this.state.coursePassInfo.minitask_solved + "/" + this.state.coursePassInfo.total_minitask)}
            </Typography>
          </Box>
          <Box p={1} color="#757575">
            {this.state.coursePassInfo.isCodePass ?
              // <Chip label="Pass" style={{ background: "#43a047", color: "white" }} />
              ""
              :
              <React.Fragment>
                <Typography variant="subtitle2">
                  {this.state.coursePassInfo.user_code_point} <EmojiNatureIcon />
                </Typography>
              </React.Fragment>}
          </Box>
        </Box>
      </React.Fragment>
    }
  }


  render() {
    const { days, hours, min, sec, courseStatus } = this.state;
    const { classes, course, page } = this.props;


    // check course statement -- Active or Inactive
    // let isActive;
    // if (course.status === "Inactive") {
    //   isActive = <p>Cần xét duyệt</p>
    // }

    let chip;
    if (course.status === " " || course.status === "Inactive") {
      chip = (<Chip
        label="Cần xét duyệt"
        color="primary"
        style={{
          width: '80%',
          height: '80%',
          fontSize: '63px'
        }}
      />)
    } else if (course.status === "Pedding") {
      chip = (<Chip
        label="Đang xét duyệt"
        color="primary"
        style={{
          width: '80%',
          height: '80%',
          fontSize: '63px'
        }}
      />)
    }
    let timer;
    if (courseStatus === 0) {
      timer = <React.Fragment>
        <Box display="flex" color="#ef5350">
          <Typography variant="button" display="block" gutterBottom>
            Đang diển ra
          </Typography>
        </Box>
        <Box mb={1} display="flex" color="#f44336">
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
        <Box display="flex" color="#757575">
          <Typography variant="button" display="block" gutterBottom>
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
      <Grid
        container
        direction="column"
        style={{
          height: "100%",
          display: "flex",
          // justifyContent: "center",
          borderRadius: 8,
          alignItems: "center",
        }}
        className={`${classes.courseItem} hvr-bounce-in`}
      >
        {/* <React.Fragment></React.Fragment> */}
        <Grid
          container
          component={Link} to={`/profile/courses/${course.id}/tasks`}
          style={{
            width: "100%",
            overflow: "hidden",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `url(${course.background_image}) no-repeat center`,
            backgroundSize: "cover",
          }}
        >
          {/* { course.status === "Pedding"  ?
            <Chip
              label="Cần xét duyệt"
              color="primary"
              style={{
                width: '80%',
                height: '80%',
                fontSize: '63px'
              }}
            />
            :
            ""
          } */}
          {chip}
          {/* <img
            src={course.background_image}
            style={{
              width: "50px",
              objectFit: "cover",
              height: "50px",
              borderRadius: "50%",
              marginTop: "10px"
            }}
            alt=""
          /> */}
        </Grid>
        <Grid item container justify="center" style={{ padding: "10px 0 0 0" }}>
          <Grid item xs>
            <div
              style={{
                margin: "0px 12px",
                // textAlign: "center",
                // textTransform: "uppercase",
                color: "#3B3C54",
                fontWeight: "bold"
                // fontFamily: `'Yanone Kaffeesatz', sans-serif`
              }}
            >
              <Link style={{ textDecoration: 'none' }} to={`/profile/courses/${course.id}/tasks`}>
                <Typography
                  gutterBottom variant="h5" component="h5"
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#3B3C54"
                  }}
                >
                  {course.course_name}
                </Typography>
              </Link>

            </div>
            <div
              style={{
                margin: "5px 12px 10px",
                // textAlign: "center",
                color: "#909090"
                // fontFamily: `'Yanone Kaffeesatz', sans-serif`
              }}
            >
              <Rating
                name="read-only"
                value={course.rating_value}
                read-only
                precision={0.1}
                size="large"
              />{" "}
              <Typography
                // variant="body1"
                color="textSecondary"
                component="p"
                style={{
                  height: 20,
                  overflow: "hidden",
                  wordBreak: "break-word",
                  fontSize: 14,
                }}
              >
                {course.course_desc}
              </Typography>
            </div>
            {!this.state.isLoadingCourseInfo ?
              this.renderPraceticeProgress(page)
              :
              <Box p={1} display="flex" justifyContent="center" color="#757575">
                <Box>
                  <Tooltip title="Loading" placement="top">
                    <CircularProgress />
                  </Tooltip>
                </Box>
              </Box>
            }
            <Divider light />
            <div
              style={{
                margin: "8px 12px",
                textAlign: "center",
                color: "#909090"

                // fontFamily: `'Yanone Kaffeesatz', sans-serif`
              }}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                {/* <Grid
                  item
                  xs
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
                    {course.user_create
                      ? course.user_create.charAt(0).toUpperCase()
                      : "H"}
                  </Avatar>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {course.user_create ? course.user_create : "Hocode"}
                  </Typography>
                </Grid> */}
                <Grid
                  item
                  xs
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Box>
                    {this.state.liked ? (<ThumbUpIcon
                      style={{
                        // color: "#fff",
                        //backgroundColor: "rgba(0, 0, 0, 0.87)",
                        padding: "2px 4px",
                        boxSizing: "content-box",
                        borderRadius: "4px",
                      }}
                      fontSize="large"
                      color="disabled"
                      onClick={
                        () => { this.handleCountLiked() }
                      }
                    />) : (<ThumbUpIcon
                      style={{
                        // color: "#fff",
                        //backgroundColor: "rgba(0, 0, 0, 0.87)",
                        padding: "2px 4px",
                        boxSizing: "content-box",
                        borderRadius: "4px",
                      }}
                      fontSize="large"
                      color="primary"
                      onClick={
                        () => { this.handleCountLiked() }
                      }
                    />)}

                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{
                      fontWeight: 1000,
                    }}
                  >
                    {/* {this.state.totalMinitask} */}
                    {course.numbers_like}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  <Box mt={1}>
                    <FacebookShareButton url="https://www.google.com/" >
                      <Grid container xs={12}>
                        <Grid xs={3}>
                          <FacebookIcon fontSize="large" />
                        </Grid>
                        <Grid container justify="center"
                          alignItems="center" xs={9}>
                          <Box mb={1}>
                            <Typography style={{fontSize:13}}>&nbsp;&nbsp;Chia sẻ</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      {/* <FacebookIcon size={30} round={true} logoFillColor="white" /> */}
                      {/* <FacebookShareCount url="https://www.google.com/">
                        {shareCount => (
                          <span className="myShareCountWrapper">{shareCount}</span>
                        )}
                      </FacebookShareCount> */}
                    </FacebookShareButton>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Divider light />
        {page === "overview" ? "" : timer}
      </Grid>
    );
  }
}

export default withStyles(styles)(CourseItem);
