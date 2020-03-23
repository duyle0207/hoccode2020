import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import CourseItem from './CourseItem';
import "./coursebody.css";
import { getUser } from "../../../../js/actions/userAction";
import { connect } from "react-redux";


import HashLoader from "react-spinners/HashLoader";
const styles = {
  CourseContainer: {
    paddingTop: "30px",
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
      courseActived : []
    };
  }
  getApi = async () => {
    await Promise.all([
      axios.get(`http://localhost:8081/api/v1/courses`).then(res => {
        const courses = res.data;
        console.log(courses)
        const courseIsActived = []
        this.setState({ courses });

        for (let i = 0; i < courses.length; i++) {
          const element = courses[i];
          if ( element.status === "Active" ||element.status === " " ) {
            courseIsActived.push(element);
          }
        }
        this.setState({courseActived:courseIsActived });
      })]
    );
    this.setState({ isLoading: false })
  }
  componentDidMount() {
    this.getApi();
  }
  render() {
    const { classes } = this.props;
    const { courses, isLoading, courseActived } = this.state;
    let url = this.props.url;
    return (
      <Grid container className={classes.CourseContainer} justify="center">
        {isLoading ? <div className="sweet-loading" style={{ display: 'flex', alignItems: "center", justifyContent: 'center', width: '100%' }}>
          <HashLoader

            sizeUnit={"px"}
            size={50}
            color={"#AEA8A8"}
            loading={isLoading}
          />
        </div> : (<React.Fragment><Grid item xs={12} sm={12} style={{ padding: "0px 60px" }}>
          {this.props.user.role === "admin" ?
           <Grid container spacing={2}>
            {courses.map((course) => <Grid key={course.id} item xs={12} sm={4} md={4}><Link style={{ textDecoration: 'none' }} to={`${url}/courses/${course.id}/tasks`}><CourseItem course={course} /></Link></Grid>)}
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
