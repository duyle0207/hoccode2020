import React from "react";

import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CardUser from './CardUser';
import UserInfo from './UserInfo';
import { withStyles } from '@material-ui/core/styles';
import CourseItem from "../course/CourseItem";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Minitask from './Minitask';
import Fade from '@material-ui/core/Fade';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box >{children}</Box>}
    </Typography>
  );
}

const styles = {
  paper: {
    padding: 16,
    // marginTop: 16,
    minHeight: 200
  },
  card: {
    maxWidth: "100%"
  },
  media: {
    // width: "100%",

    height: 180,
    objectFit: "cover"
  }
};
const titleCase = string => {
  return string
    .toLowerCase()
    .split(" ")
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      courses: [],
      events: [],
      books: [],
      daily_minitask: {},
      isLoadingCoursePassInfo: true,
      totalCourse: 0,
      chartInfo: [],
      newestCourse: [],
      tab: 0,
      threeRandomMinitask: [],
    };
    this.getApi = this.getApi.bind(this);
  }

  handleChangeTab = (event, newValue) => {
    this.setState({ tab: newValue });
  }

  getApi = async () => {
    await Promise.all([
      axios.get(`http://localhost:8081/auth/usercourse`).then(res => {
        const courses = res.data;
        console.log(courses);
        this.setState({ courses: courses.course_info });
        var c = this.state.courses;
        this.state.courses.forEach((e, i) => {
          axios.get(`http://localhost:8081/api/v1/curd/getCoursePassInfo/${e.course_id}`).then(res => {
            // console.log("[CoursePass]");
            // console.log(res.data);
            // c[i].progress = res.data.minitask_solved +"/"+res.data.total_minitask
            c[i].completed_tasks_count = res.data.minitask_solved
            c[i].total_tasks_count = res.data.total_minitask
            this.setState({ courses: c, isLoadingCoursePassInfo: false });
          });
        });
      }).catch(err => {
        console.log(err);
      }),

      axios.get(`http://localhost:8081/api/v1/events`).then(res => {
        const events = res.data;
        console.log(events);
        this.setState({ events });
      }),
      axios.get(`http://localhost:8081/api/v1/books`).then(res => {
        const books = res.data;
        console.log(books);
        this.setState({ books });
      }),
      axios.get(`http://localhost:8081/api/v1/dailyminitask`).then(res => {
        const daily_minitasks = res.data;
        console.log(daily_minitasks);
        this.setState({ daily_minitasks: daily_minitasks });
      }),
      axios.get(`http://localhost:8081/api/v1/totalCourse`).then(res => {
        console.log(res.data);
        this.setState({ totalCourse: res.data });
      }),
      axios.get(`http://localhost:8081/api/v1/curd/getChartInfo`).then(res => {
        console.log(res.data);
        this.setState({ chartInfo: res.data });
      }),
      axios.get(`http://localhost:8081/api/v1/getNewestCourse`).then(res => {
        console.log(res.data);
        this.setState({ newestCourse: res.data });
      }),
      axios.get(`http://localhost:8081/api/v1/curd/get3RandomMinitask`).then(res => {
        console.log(res.data);
        this.setState({ threeRandomMinitask: res.data });
      }),
    ]);
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    document.title = "Lập trình mỗi ngày để trở thành lập trình viên ưu tú";
    this.getApi();
  }

  renderLevelMinitaskChip(minitask) {
    minitask.level = titleCase(minitask.level);
    console.log(minitask.level);
    if (minitask.level === "Easy") {
      return (
        <Chip
          style={{ background: "#76d38e", color: "white" }}
          size="small"
          label={`${minitask.level}`}
        />
      );
    } else if (minitask.level === "Medium") {
      return (
        <Chip
          style={{ background: "#1d97c6", color: "white" }}
          size="small"
          label={`${minitask.level}`}
        />
      );
    } else {
      return (
        <Chip
          style={{ background: "red", color: "white" }}
          size="small"
          label={`${minitask.level}`}
        />
      );
    }
  }

  render() {
    const { isLoading, isLoadingCoursePassInfo, totalCourse, chartInfo, courses, newestCourse, tab, threeRandomMinitask } = this.state;
    const { classes } = this.props;
    let url = this.props.url;
    const newestCourseList = newestCourse.map((course, i) => {
      return <Grid item xs={12} sm={3} md={3}>
        <Typography variant="subtitle1">
          <CourseItem course={course} page={"overview"} />
        </Typography>
      </Grid>
    });

    const threeRandomMinitaskList = threeRandomMinitask.map((minitask, i) => {
      return <Minitask minitask={minitask} />
    })

    return (
      <Grid spacing={2}>
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
              <Grid item xs={12} sm={12} md={12}>
                <Paper className={classes.paper}>
                  <Box my={2} mx={1}>
                    <Typography variant="h5" style={{ fontSize: 18, fontWeight: 450 }}>Xin chào <span style={{ fontSize: 18, color: "#DB3B56" }}>{this.props.user.firstname}</span>.
                    Chào mừng bạn đến với Hocode, tiếp tục khám phá nhé!</Typography>
                  </Box>
                  <Box my={4} mx={1}>
                    <Grid container>
                      <Grid item sm={3}>
                        <CardUser user={this.props.user} />
                      </Grid>
                      <Grid item sm={9}>
                        <UserInfo totalCourse={totalCourse} userCourse={courses} minitaskInfo={chartInfo} />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Box my={2}>
                <Typography variant="h3" style={{ fontSize: 30, fontWeight: 500, color: "#3B3B3B" }}>Khóa học</Typography>
              </Box>
              <AppBar position="static">
                <Tabs value={tab} onChange={this.handleChangeTab} style={{ color: "#3B3B3B", backgroundColor: "white" }}>
                  <Tab label={<Typography style={{ fontSize: 18, fontWeight: 500, textTransform: 'none' }}>Khóa học gợi ý</Typography>} />
                  <Tab label={<Typography style={{ fontSize: 18, fontWeight: 500, textTransform: 'none' }}>Đang học ({courses.length})</Typography>} />
                </Tabs>
              </AppBar>
              <TabPanel value={tab} index={0}>
                <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Paper className={classes.paper}>
                      <Grid container xs={12} spacing={2}>
                        {newestCourseList}
                      </Grid>
                      <Box my={3} mr={1}>
                        <Grid container xs={12} spacing={2} justify="flex-end">
                          <Link
                            style={{ textDecoration: 'none' }}
                            className="item"
                            to={"/profile/course"}
                          >
                            <Typography style={{ fontSize: 18, fontWeight: 400, textTransform: 'none' }}>Xem tất cả</Typography>
                          </Link>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                </Fade>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Paper className={classes.paper}>
                      <Grid container style={{ marginBottom: 15 }}>
                        <Grid item style={{ flexGrow: 1 }}>
                          <div style={{ fontWeight: "bold" }}>Khóa học đã tham gia</div>{" "}
                        </Grid>
                      </Grid>
                      {this.state.courses.length === 0 ? (
                        <div style={{}}>Bạn chưa tham gia khóa học nào.</div>
                      ) : (
                          this.state.courses.map(course => {
                            return (
                              <React.Fragment key={course.course_id}>
                                <Grid
                                  container
                                  style={{ alignItems: "center", flexWrap: "unset" }}
                                >
                                  <Grid item>
                                    <img
                                      className={classes.img}
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        borderRadius: "8px"
                                      }}
                                      alt="complex"
                                      src={course.background_image}
                                    />
                                  </Grid>
                                  <Grid item style={{ flexGrow: 1, padding: 10 }}>
                                    <Tooltip title="Tên chủ đề" placement="top">
                                      <div style={{ fontWeight: "bold" }}>
                                        <Link
                                          className="item"
                                          key={course.course_id}
                                          style={{ textDecoration: "none" }}
                                          to={`${url}/courses/${course.course_id}/tasks`}
                                        >
                                          <Typography variant="subtitle1">
                                            {course.course_name}
                                          </Typography>
                                        </Link>
                                      </div>
                                    </Tooltip>
                                    <Tooltip
                                      title="Số lượng bài học đã hoàn thành"
                                      placement="top"
                                    >
                                      {isLoadingCoursePassInfo ?
                                        <CircularProgress size={22} color="black" />
                                        :
                                        <div style={{ color: "#9d9d9d" }}>
                                          {course.completed_tasks_count}/
                                      {course.total_tasks_count}
                                        </div>}
                                    </Tooltip>
                                  </Grid>
                                  <Grid item>
                                    <Tooltip title="Tiến độ" placement="top">
                                      <LinearProgress
                                        variant="determinate"
                                        value={
                                          (course.completed_tasks_count /
                                            course.total_tasks_count) *
                                          100
                                        }
                                        style={{ width: 115 }}
                                      />
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                                <Divider style={{ margin: "auto" }} />{" "}
                              </React.Fragment>
                            );
                          })
                        )}
                    </Paper>
                  </Grid>
                </Fade>
              </TabPanel>
              <Box my={2}>
                <Typography variant="h3" style={{ fontSize: 30, fontWeight: 500, color: "#3B3B3B" }}>Luyện tập hàng ngày</Typography>
              </Box>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={8} md={8} sm={8}>
                  <Paper className={classes.paper}>
                    <Grid container xs={12}>
                      <Grid item xs={4} md={4} sm={4}>
                        <Box p={2}>
                          <Typography variant="h3" style={{ fontSize: 25, fontWeight: 400, color: "#7BC043" }}>{chartInfo.easy + "/" + chartInfo.total_easy}</Typography>
                          <Typography variant="h3" style={{ fontSize: 28, fontWeight: 100, color: "#3B3B3B" }}>Đơn giản</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4} md={4} sm={4}>
                        <Box p={2}>
                          <Typography variant="h3" style={{ fontSize: 25, fontWeight: 400, color: "#FAA05E" }}>{chartInfo.medium + "/" + chartInfo.total_medium}</Typography>
                          <Typography variant="h3" style={{ fontSize: 28, fontWeight: 100, color: "#3B3B3B" }}>Trung bình</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4} md={4} sm={4}>
                        <Box p={2}>
                          <Typography variant="h3" style={{ fontSize: 25, fontWeight: 400, color: "#F1646C" }}>{chartInfo.hard + "/" + chartInfo.total_hard}</Typography>
                          <Typography variant="h3" style={{ fontSize: 28, fontWeight: 100, color: "#3B3B3B" }}>Phức tạp</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Box mt={1}>
                      <Grid container style={{ marginBottom: 15 }}>
                        <Grid item style={{ flexGrow: 1 }}>
                          <div style={{ fontWeight: "bold" }}>Bài tập cho hôm nay :)</div>{" "}
                        </Grid>
                      </Grid>
                    </Box>
                    <Grid container xs={12} spacing={1}>
                      {threeRandomMinitaskList}
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={4} md={4} sm={4}>
                  <Paper className={classes.paper}>
                    <Grid container style={{ marginBottom: 15 }}>
                      <Grid item style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: "bold" }}>Thách thức mới</div>{" "}
                      </Grid>
                    </Grid>
                    {this.state.daily_minitasks.map(daily_minitask => {
                      return (
                        <React.Fragment key={daily_minitask.id}>
                          <Grid
                            container
                            style={{ alignItems: "center", flexWrap: "unset" }}
                          >
                            <Grid item>
                              <img
                                className={classes.img}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "8px"
                                }}
                                alt="complex"
                                src={daily_minitask.avatar}
                              />
                            </Grid>
                            <Grid item style={{ flexGrow: 1, padding: 10 }}>
                              <div style={{ fontWeight: "bold" }}>
                                <Link
                                  className="item"
                                  style={{ textDecoration: "none" }}
                                  to={`/minitask/${daily_minitask.id}`}
                                >
                                  {daily_minitask.mini_task_name}
                                </Link>
                              </div>
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <Tooltip title="Số đậu" placement="top">
                                  <div style={{ color: "#9d9d9d" }}>
                                    Số đậu: {daily_minitask.code_point}
                                  </div>
                                </Tooltip>
                                <Tooltip title="Độ khó" placement="top">
                                  <div style={{ marginLeft: 10 }}>
                                    {this.renderLevelMinitaskChip(daily_minitask)}
                                  </div>
                                </Tooltip>
                              </div>
                            </Grid>
                          </Grid>
                          <Divider style={{ margin: "auto" }} />{" "}
                        </React.Fragment>
                      );
                    })}
                  </Paper>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  user: state.rootReducer.user
});
export default withStyles(styles)(connect(mapStateToProps, {})(Overview));
