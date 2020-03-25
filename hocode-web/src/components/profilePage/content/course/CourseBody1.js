import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
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
import { Box } from "@material-ui/core";
const styles = {
  CourseContainer: {
    paddingTop: "30px",
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
    };
  }
  getApi = async () => {
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
      })]
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
    } if (status === 1) {
      const courseFilter = courses.filter(e => e.status === "Active");
      this.setState({ coursesTemp: courseFilter, courseStatus: 1 });
    }
  }

  render() {
    const { classes } = this.props;
    const { coursesTemp, isLoading, courseActived, courseStatus } = this.state;
    let url = this.props.url;
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
              <Grid item xs={12} sm={12} style={{}}>
                {this.props.user.role === "admin" ?
                  <Box p={2}>
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
                      </Select>
                    </FormControl>
                  </Box>
                  :
                  ""
                }
                {this.props.user.role === "admin" ?
                  <Grid container spacing={2}>
                    {coursesTemp.map((course) => <Grid key={course.id} item xs={12} sm={4} md={4}><Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}><CourseItem course={course} /></Link></Grid>)}
                  </Grid> : (
                    <Grid container spacing={2}>
                      {courseActived.map((course) => <Grid key={course.id} item xs={12} sm={4} md={4}><Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}><CourseItem course={course} /></Link></Grid>)}
                    </Grid>
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
