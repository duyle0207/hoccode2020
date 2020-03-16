import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple, green, pink } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LaptopIcon from "@material-ui/icons/Laptop";
import Rating from "@material-ui/lab/Rating";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import "./hover.css";
import axios from "axios";
import Box from "@material-ui/core/Box";
import {
  // FacebookShareCount,
  FacebookIcon,
  FacebookShareButton
} from "react-share";

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
    background: "white",
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
      totalMinitask: 0
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:8081/totalMinitask/${this.props.course.id}`).then(res => {
      this.setState({ totalMinitask: res.data })
    });
  }

  render() {
    const { classes, course } = this.props;
    return (
      <Grid
        container
        direction="column"
        style={{
          height: "100%",
          display: "flex",
          // justifyContent: "center",
          alignItems: "center"
        }}
        className={`${classes.courseItem} hvr-bounce-in`}
      >
        <Grid
          item
          style={{
            width: "100%",
            overflow: "hidden",
            height: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `url(${course.background_image}) no-repeat center`,
            backgroundSize: "cover"
          }}
        >
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
                textTransform: "uppercase",
                color: "#595959",
                fontWeight: "bold"
                // fontFamily: `'Yanone Kaffeesatz', sans-serif`
              }}
            >
              <Typography gutterBottom variant="h5" component="h2">
                {course.course_name}
              </Typography>
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
                variant="body1"
                color="textSecondary"
                component="p"
                style={{
                  height: 40,
                  overflow: "hidden",

                  wordBreak: "break-word"
                }}
              >
                {course.course_desc}
              </Typography>
            </div>
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
                <Grid
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
                    {/* {course.total_minitask} */}
                    {course.user_create ? course.user_create : "Hocode"}
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
                  <LaptopIcon
                    style={{
                      // color: "#fff",
                      // backgroundColor: "rgba(0, 0, 0, 0.87)",
                      padding: "2px 4px",
                      boxSizing: "content-box",
                      borderRadius: "4px"
                    }}
                    fontSize="small"
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {this.state.totalMinitask}
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
                      <FacebookIcon size={30} round={true} />
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
      </Grid>
    );
  }
}

export default withStyles(styles)(CourseItem);
