import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
// import { Link } from "react-router-dom";
import axios from "axios";
import CourseItem from './CourseItem';
import "./coursebody.css";
import { getUser } from "../../../../js/actions/userAction";
import { connect } from "react-redux";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import HashLoader from "react-spinners/HashLoader";
import { Box, Typography, Fade } from "@material-ui/core";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';

const styles = {
  CourseContainer: {
    // paddingTop: "30px",
    minHeight: "100vh"
  },
  CourseContainer1: {
    paddingTop: "",
    minHeight: "100vh"
  },
  courseItem: {
    borderRadius: '4px',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    background: '#EEEEEE',
    cursor: 'pointer',
  },
};

const permissionslocal = localStorage.getItem("permissions");
console.log(permissionslocal);

class CourseBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      courses: [],
      coursesTemp: [],
      courseActived: [],
      courseStatus: 0,
      keyword: "",
      lap_trinh_co_so_id: "5e9a6d398bf11c0e089af771",
      lap_trinh_co_so_list: [],
      lap_trinh_nang_cao_id: "5e9a6d698bf11c0e089af772",
      lap_trinh_nang_cao_list: [],
      giai_quyet_van_de_id: "5e9a6d738bf11c0e089af773",
      giai_quyet_van_de_list: [],
    };
  }
  getApi = async () => {
    const { lap_trinh_co_so_id, lap_trinh_nang_cao_id, giai_quyet_van_de_id } = this.state;
    await Promise.all([
      axios.get(`http://localhost:8081/api/v1/courses`).then(res => {
        const courses = res.data;
        console.log(courses)
        const courseIsActived = []
        this.setState({ courses, coursesTemp: courses });

        for (let i = 0; i < courses.length; i++) {
          const element = courses[i];
          if (element.status === "Active" || element.status === " ") {
            courseIsActived.push(element);
          }
        }
        this.setState({ courseActived: courseIsActived });
      }),
      axios.get(`http://localhost:8081/api/v1/getCourseByCourseType/${lap_trinh_co_so_id}`).then(res => {
        console.log(res.data);
        this.setState({
          lap_trinh_co_so_list: res.data,
        })
      }),
      axios.get(`http://localhost:8081/api/v1/getCourseByCourseType/${lap_trinh_nang_cao_id}`).then(res => {
        console.log(res.data);
        this.setState({
          lap_trinh_nang_cao_list: res.data,
        })
      }),
      axios.get(`http://localhost:8081/api/v1/getCourseByCourseType/${giai_quyet_van_de_id}`).then(res => {
        console.log(res.data);
        this.setState({
          giai_quyet_van_de_list: res.data,
        })
      }),
    ]
    );
    this.setState({ isLoading: false })
  }

  componentDidMount() {
    this.getApi();
  }

  handleChangeSelect = async (event) => {
    const status = event.target.value;
    const { courses, coursesTemp } = this.state;
    console.log(coursesTemp);
    if (status === 0) {
      this.setState({ coursesTemp: courses, courseStatus: 0 });
    }
    else if (status === -1) {
      const courseFilter = courses.filter(e => e.status === "Inactive");
      this.setState({ coursesTemp: courseFilter, courseStatus: -1 });
    } else if (status === 1) {
      const courseFilter = courses.filter(e => e.status === "Active");
      this.setState({ coursesTemp: courseFilter, courseStatus: 1 });
    } if (status === 2) {
      const courseFilter = courses.filter(e => e.status === "Pedding");
      this.setState({ coursesTemp: courseFilter, courseStatus: 2 });
    }
  }

  renderCourseTypeTitle = (title) => {
    return <Box mt={4} mb={1}>
      <Typography style={{ fontSize: 30, fontWeight: 700, color: "#3B3C54" }}>{title}</Typography>
    </Box>
  }

  onHandleSearch = (event) => {
    const keyword = event.target.value;
    console.log(keyword);
    this.setState({
      keyword,
    }, () => {
      const { keyword, lap_trinh_co_so_id, lap_trinh_nang_cao_id, giai_quyet_van_de_id } = this.state;
      axios.get(`http://localhost:8081/api/v1/searchCourseByCourseType/${lap_trinh_co_so_id}/${keyword}/`).then(res => {
        console.log(res.data);
        this.setState({
          lap_trinh_co_so_list: res.data,
        })
      });
      axios.get(`http://localhost:8081/api/v1/searchCourseByCourseType/${lap_trinh_nang_cao_id}/${keyword}/`).then(res => {
        console.log(res.data);
        this.setState({
          lap_trinh_nang_cao_list: res.data,
        })
      });
      axios.get(`http://localhost:8081/api/v1/searchCourseByCourseType/${giai_quyet_van_de_id}/${keyword}/`).then(res => {
        console.log(res.data);
        this.setState({
          giai_quyet_van_de_list: res.data,
        })
      });
    })
  };

  render() {
    const { classes } = this.props;
    const { coursesTemp, isLoading, courseStatus, lap_trinh_co_so_list, lap_trinh_nang_cao_list, giai_quyet_van_de_list, keyword } = this.state;
    // let url = this.props.url;
    
    return (
      <Grid container className={this.props.user.role === "admin" ? classes.CourseContainer1 : classes.CourseContainer} justify="center">
        {isLoading ? <div className="sweet-loading" style={{ display: 'flex', alignItems: "center", justifyContent: 'center', width: '100%' }}>
          <HashLoader
            sizeUnit={"px"}
            size={50}
            color={"#AEA8A8"}
            loading={isLoading}
          />
        </div> : (
            <React.Fragment>
              <Grid item xs={12} sm={12}>
                {this.props.user.role === "admin" ?
                  <Box p={1}>
                    <FormControl style={{ width: '15%' }}>
                      <InputLabel id="demo-simple-select-label">Tình trạng</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={courseStatus}
                        style={{ height: 30 }}
                        onChange={this.handleChangeSelect}
                      >
                        <MenuItem value={0}>Tất cả</MenuItem>
                        <MenuItem value={1}>Đã duyệt</MenuItem>
                        <MenuItem value={-1}>Cần xét duyệt</MenuItem>
                        <MenuItem value={2}>Đang xét duyệt</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  :
                  ""
                }
                {this.props.user.role !== "admin" ?
                  <Box my={2}>
                    <Grid container xs={12} style={{ backgroundColor: "#D4D5F5", borderRadius: "8px" }}>
                      <Grid container direction="column" xs={8} justify="center">
                        <Box mx={8} my={5}>
                          <Grid container>
                            <Typography style={{ fontSize: 40, fontWeight: 450 }}>Học tập cùng <span style={{ fontSize: 40, color: "#2C31CF" }}>chuyên gia</span>,</Typography>
                          </Grid>
                          <Grid container>
                            <Typography style={{ fontSize: 22, fontWeight: 450 }}>tham gia khoá học lập trình để nâng cao kỹ năng bản thân!</Typography>
                          </Grid>
                          <Grid container>
                            <FormControl style={{ width: '100%', marginTop: 10 }}>
                              <TextField id="outlined-basic"
                                placeholder="Nhập nội dung tìm kiếm"
                                variant="outlined"
                                value={keyword}
                                style={{ backgroundColor: "white", borderRadius: 4, }}
                                onChange={this.onHandleSearch}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs={4} justify="center" alignItems="center">
                        <Box mx={8} my={5}>
                          <img
                            className={classes.img}
                            style={{
                              width: "200",
                              height: "200",
                              objectFit: "cover",
                              borderRadius: "8px"
                            }}
                            alt="complex"
                            src={"https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/course/course-head.png"}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  :
                  ""
                }
                {this.props.user.role === "admin" ?
                  <React.Fragment>
                    <Grid container spacing={3}>
                      {coursesTemp.map((course) =>
                        <Grid key={course.id} item xs={12} sm={3} md={3}>
                          {/* <Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}> */}
                            <CourseItem course={course} />
                          {/* </Link> */}
                        </Grid>
                      )}
                    </Grid>
                  </React.Fragment>
                  : (
                    <React.Fragment>
                      {
                        lap_trinh_co_so_list.length === 0 ? "" :
                          <React.Fragment>
                            {this.renderCourseTypeTitle("Lập trình cơ sở")}
                            <Grid container spacing={4}>
                              {lap_trinh_co_so_list.map((course) =>
                                <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                                  <Grid key={course.id} item xs={12} sm={3} md={3}>
                                    {/* <Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}> */}
                                      <CourseItem course={course} />
                                    {/* </Link> */}
                                  </Grid>
                                </Fade>
                              )}
                            </Grid>
                          </React.Fragment>
                      }
                      {
                        lap_trinh_nang_cao_list.length === 0 ? "" :
                          <React.Fragment>
                            {this.renderCourseTypeTitle("Lập trình nâng cao")}
                            <Grid container spacing={4}>
                              {lap_trinh_nang_cao_list.map((course) =>
                                <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                                  <Grid key={course.id} item xs={12} sm={3} md={3}>
                                    {/* <Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}> */}
                                      <CourseItem course={course} />
                                    {/* </Link> */}
                                  </Grid>
                                </Fade>
                              )}
                            </Grid>
                          </React.Fragment>
                      }
                      {
                        giai_quyet_van_de_list.length === 0 ? "" :
                          <React.Fragment>
                            {this.renderCourseTypeTitle("Giải quyết vấn đề")}
                            <Grid container spacing={4}>
                              {giai_quyet_van_de_list.map((course) =>
                                <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                                  <Grid key={course.id} item xs={12} sm={3} md={3}>
                                    {/* <Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}> */}
                                      <CourseItem course={course} />
                                    {/* </Link> */}
                                  </Grid>
                                </Fade>
                              )}
                            </Grid>
                          </React.Fragment>
                      }
                      {
                        (giai_quyet_van_de_list.length === 0 && lap_trinh_co_so_list.length === 0 && lap_trinh_nang_cao_list.length === 0) ?
                          <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                            <React.Fragment>
                              <Box p={2} display="flex" justifyContent="center" alignItems="center">
                                <img
                                  className={classes.img}
                                  style={{
                                    width: "350px",
                                    height: "500",
                                    // objectFit: "cover",
                                    borderRadius: "8px"
                                  }}
                                  alt="complex"
                                  src={"https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/code-learn/not-found.svg"}
                                />
                              </Box>
                              <Box display="flex" justifyContent="center" alignItems="center">
                                <Typography style={{ fontSize: 20, fontWeight: 1000 }}>Không tìm thấy dữ liệu</Typography>
                              </Box>
                            </React.Fragment>
                          </Fade>
                          : ""
                      }
                    </React.Fragment>
                  )
                }
                {/* <Grid container spacing={2}>
            {courses.map((course) => <Grid key={course.id} item xs={12} sm={4} md={4}><Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}><CourseItem course={course} /></Link></Grid>)}
          </Grid> */}
              </Grid></React.Fragment>)}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  errors: state.rootReducer.errors,
  user: state.rootReducer.user
});

export default withStyles(styles)(connect(mapStateToProps, { getUser })(CourseBody));
