import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { loginUser, registerUser, setCurrentUser } from "../../js/actions/authActions";

import FacebookLogin from 'react-facebook-login';
import '../../App.css';
import GoogleLogin from 'react-google-login';

import axios from "axios";

// import setAuthToken from "../../js/utils/setAuthToken";
// import jwt_decode from "jwt-decode";

// import {
//   FacebookShareCount,
//   FacebookIcon,
//   FacebookShareButton
// } from "react-share";

import "./LoginPage.css";


const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#3f51b5"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#3f51b5"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#3f51b5"
      },
      "&:hover fieldset": {
        borderColor: "#3f51b5"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3f51b5"
      }
    }
  }
})(TextField);

const styles = {
  "@global": {
    body: {
      backgroundColor: "white"
    }
  },
  paper: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    backgroundColor: "#3f51b5"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 8
  },
  submit: {
    margin: "5px 0px"
  }
};
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="/">
        hocodevn.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      remember: true,
      isLoading: false,
      errors: {},
      // userDataRegister: {
      //   email: "",
      //   password: "",
      //   firstName: "",
      //   lastName: "",
      //   avatar: ""
      // }
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }

    if (nextProps.errors) {
      nextProps.errors.message = "*" + nextProps.errors.message;
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  onSubmitTest = e => {
    this.setState({
      email: "thiennd@gmail.com",
      password: "Thien123"
    });
  };

  onSubmit = async e => {
    e.preventDefault();

    this.setState({ isLoading: true });
    const userData = {
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember
    };

    var loginF = Promise.all([this.props.loginUser(userData)]);

    loginF.then(val => {
      this.setState({ isLoading: false });
    });

  };

  responseFacebook = (response) => {
    console.log(response);

    const userData = {
      email: response.email,
      password: response.email + response.id,
      firstName: response.name,
      lastName: "",
      avt: response.picture.data.url,
      socialAccount: "facebook",
      remember: true
    }

    axios
      .post("http://localhost:8081/api/v1/isNewAccount", userData)
      .then(res => {
        console.log(res);
        if (res.data === "new") {
          axios
            .post("http://localhost:8081/api/v1/signup", userData)
            .then(res => {

              console.log(userData);

              var loginF = Promise.all([this.props.loginUser(userData)]);

              loginF.then(val => {
                this.setState({ isLoading: false });
              });
            })
        }
        else {

          var loginF = Promise.all([this.props.loginUser(userData)]);

          loginF.then(val => {
            this.setState({ isLoading: false });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  responseGoogle = (response) => {
    console.log(response.Qt.jL);
    console.log(response.profileObj.email);
    console.log(response.accessToken);

    const userData = {
      email: response.profileObj.email,
      avt: response.profileObj.imageUrl,
      password: response.profileObj.email +
        response.profileObj.googleId,
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName,
      socialAccount: "google",
      remember: true
    }

    axios
      .post("http://localhost:8081/api/v1/isNewAccount", userData)
      .then(res => {
        console.log(res);
        if (res.data === "new") {
          axios
            .post("http://localhost:8081/api/v1/signup", userData)
            .then(res => {
              console.log(res);

              var loginF = Promise.all([this.props.loginUser(userData)]);

              loginF.then(val => {
                this.setState({ isLoading: false });
              });

            })
            .catch(err => {
              console.log(err);
            });
        }
        else {
          var loginF = Promise.all([this.props.loginUser(userData)]);

          loginF.then(val => {
            this.setState({ isLoading: false });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });

    console.log(userData);
  }

  render() {
    const { errors } = this.state;
    const { classes } = this.props;
    // const primary = red[500]; // #F44336

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Box
            justifyContent="center"
            borderBottom={24}
            color={"rgba(255, 255, 255, 0.1)"}
          >
            <div className="logo">
              <Link to="/profile">
                <img
                  src={process.env.PUBLIC_URL + "/logo.png"}
                  alt=""
                  style={{ height: "80px" }}
                ></img>
              </Link>
            </div>
          </Box>

          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>

          <form className={classes.form} noValidate onSubmit={this.onSubmit}>
            <div>
              <div className="error_show">{errors.message}</div>
            </div>

            <CssTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              onChange={this.onChange}
              value={this.state.email}
              autoComplete="email"
              autoFocus
            />
            <CssTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.onChange}
              value={this.state.password}
            />
            <Grid container>
              <Grid item xs>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      onChange={this.handleChange("remember")}
                      checked={this.state.remember}
                    />
                  }
                  label="Lưu tài khoản"
                />
              </Grid>
              {/* <Button variant="contained" onClick={this.onSubmitTest}>
                Tài khoản admin test
              </Button> */}
              {/* <Button variant="contained" onClick={this.onSubmitTest}>
                Tài khoản mod test
              </Button> */}
            </Grid>

            {/* <Button fullWidth variant="contained" onClick={this.onSubmitTest}>
              Tài khoản admin test
            </Button> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {this.state.isLoading ? (
                <CircularProgress
                  size={22}
                  color="#fff"
                  style={{ margin: 2 }}
                />
              ) : (
                  "Đăng nhập"
                )}
            </Button>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3} ></Grid>
              <Grid item xs={6} sm={3} ></Grid>
              <Grid item xs={6} sm={3} >
                <FacebookLogin
                  isDisabled={false}
                  appId="652851902151426" //APP ID NOT CREATED YET
                  fields="name,email,picture"
                  textButton=""
                  scope="public_profile, email, user_birthday"
                  returnScopes={true}
                  size="small"
                  icon={<i className="fab fa-facebook-f icon ml-3 mt-1"></i>}
                  version="2.3"
                  cssClass="btnFacebook"
                  // icon="fa-facebook"
                  callback={this.responseFacebook}
                // autoLoad={true}
                />
                {/* <FacebookLogin
                  appId="652851902151426" //APP ID NOT CREATED YET
                  fields="name,email,picture"
                  textButton="Facebook"
                  size="small"
                  icon={<i className="fab fa-facebook-f icon ml-3 mt-1"></i>}
                  version="2.3"
                  cssClass="btnFacebook"
                  callback={this.responseFacebook}
                // autoLoad={true}
                /> */}
                {/* <div class="fb-login-button" style={{ 'float': 'left' }} data-width="" data-size="large" data-button-type="continue_with" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
              </Grid>
              <Grid item xs={6} sm={3}>
                {/* <div class="ui-content align-icon-right">
              <span class="ui-text">
                <img class="social-btn-icon" alt="Login with Facebook" src="https://hrcdn.net/fcore/assets/facebook-colored-af4249157d.svg" />
              </span>
            </div> */}
                <GoogleLogin
                  clientId="191659603798-o1h3pffa90vi6dkmufi1btf3t05vk8r7.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                  // scope="profile,email"
                  className="btnGoogle"
                  // buttonText="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Google"
                  buttonText=""
                  icon={false}
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                // autoLoad={true}
                />
                {/* <div class="fb-login-button" style={{ 'float': 'left' }} data-width="" data-size="large" data-button-type="continue_with" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link to="#" variant="body2">
                  {/* Quên tài khoản */}
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body1">
                  {"Nếu bạn chưa có tài khoản, Hãy đăng ký ngay"}
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <Link to="#" variant="body2"></Link>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLScGsL9g_Hot55sUbVHb0O7uBsWtkBrDE65fmETvflcxvuCdvw/viewform?usp=sf_link"
                    // variant="subtitle1"
                    target="_blank"
                    rel="noopener noreferrer"
                    // ref={element => {
                    //   if (element)
                    //     element.style.setProperty(
                    //       "color",
                    //       "#ff5722",
                    //       "important"
                    //     );
                    // }}
                    style={{
                      textDecoration: "none",
                      color: "#ff5722!important"
                    }}
                  >
                    Đăng ký trở thành giáo viên
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  errors: state.rootReducer.errors
});
export default withStyles(styles)(
  connect(mapStateToProps, { loginUser, registerUser, setCurrentUser })(LoginPage)
);
