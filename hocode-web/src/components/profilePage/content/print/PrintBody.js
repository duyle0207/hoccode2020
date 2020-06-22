import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
// import { Link } from "react-router-dom";
// import Divider from "@material-ui/core/Divider";
import Certificate from "./Certificate";
import ReactToPrint from "react-to-print";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import Box from "@material-ui/core/Box";
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Course from './Course';
import Practice from './Practice';
import Slide from '@material-ui/core/Fade';
import CardMedia from '@material-ui/core/CardMedia';

// const styles = {};

class PrintBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minitasks: [],
      openDialogCertificate: false,
      isLoading: true,
      certificateViewStart: {},
      certificate: {},
      review_point: 5000,
      user_codepoint: 0,
      isLoadingCert: false,
      user_course: [],
      user_practice_info: {},
    };
  }

  getApi = async () => {
    await Promise.all([
      // axios
      //   .get(`http://localhost:8081/api/v1/curd/configs/byname/hocode`)
      //   .then(res => {
      //     console.log(res.data);
      //     const certificateConfig = res.data;

      //     this.setState({ review_point: certificateConfig.review_point });
      //   }),
      axios.get("http://localhost:8081/auth/userinfo").then(res => {
        console.log(res.data);
        this.setState({ user_codepoint: res.data.codepoint });
      }),
      axios.get(`http://localhost:8081/api/v1/auth/viewcert`).then(res => {
        const certificate = res.data;
        console.log(res.data);
        this.setState({ certificateViewStart: certificate });
      }),
      axios.get(`http://localhost:8081/api/v1/auth/usercourseProfile`).then(res => {
        console.log(res.data);
        this.setState({ user_course: res.data });
      }),
      axios.get(`http://localhost:8081/api/v1/curd/getChartInfo`).then(res => {
        console.log(res.data);
        this.setState({ user_practice_info: res.data })
      })
    ]);
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    this.getApi();
  }
  getCertificate = async () => {
    this.setState({ isLoadingCert: true });
    this.setState({
      openDialogCertificate: true
    });
    await Promise.all([
      axios.get(`http://localhost:8081/api/v1/auth/reviewcert`).then(res => {
        const certificate = res.data;
        console.log(res.data);
        this.setState({ certificateViewStart: certificate });
        this.setState({ isLoadingCert: false });

      })
    ]);
  };
  handleDialogCertificateOpen = () => {
    this.setState({
      openDialogCertificate: true
    });
    //this.getCertificate();
  };
  handleDialogCertificateCheck = () => {

    this.getCertificate();
  };

  handleDialogCertificateClose = () => {
    this.setState({ openDialogCertificate: false });
  };
  renderButtonCertificate(certificateViewStart) {
    if (certificateViewStart.cert !== undefined) {
      if (certificateViewStart.cert.status === "Inactive" || certificateViewStart.cert.status === "") {
        return (
          <Button
            variant="contained"
            style={{ background: "#1ECD97", color: "#fff" }}
            onClick={this.handleDialogCertificateCheck}
          >
            Xét chứng chỉ
          </Button>
        );
      }
      else if (certificateViewStart.cert.status === "Active") {
        return (
          <Button
            variant="contained"
            style={{ background: "#1ECD97", color: "#fff" }}
            onClick={this.handleDialogCertificateOpen}
          >
            Xem chứng chỉ
          </Button>
        );
      }
      else {
        return (
          <Button
            variant="contained"
            style={{ background: "#1ECD97", color: "#fff" }}
            onClick={this.handleDialogCertificateOpen}
            disabled={true}
          >
            Đang xét chứng chỉ
          </Button>
        );
      }
    }

  }

  renderDialog = (certificate) => {
    if (certificate.cert !== undefined) {
      if (certificate.cert.status === "Inactive" || certificate.cert.status === "") {
        return (
          <DialogContent dividers>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginLeft: 4, textAlign: "center" }}
            >
              Bạn sẽ nhận được chứng chỉ nếu số đậu của bạn lớn hơn{" "}
              {this.state.review_point}
            </Typography>
          </DialogContent>
        )
      }
      else if (certificate.cert.status === "Active") {
        return (<>

          <DialogContent dividers>

            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                md={12}
                sm={12}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Certificate
                  ref={el => (this.CertificateRef = el)}
                  Certificate={this.state.certificateViewStart}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogTitle
            id="customized-dialog-title"
            onClose={this.handleDialogCertificateClose}
          >
            <Grid
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <ReactToPrint
                trigger={() => (
                  <Button
                    style={{ background: "#1ECD97", color: "#fff" }}
                    variant="contained"
                  >
                    In chứng chỉ
                  </Button>
                )}
                content={() => this.CertificateRef}
              />
            </Grid>
          </DialogTitle>
        </>)
      }
      else {
        return (
          <DialogContent dividers>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ marginLeft: 4, textAlign: "center" }}
            >
              Đã gửi yêu cầu xét chứng chỉ.
            </Typography>
          </DialogContent>
        )
      }
    }
  }

  render() {
    // const { classes } = this.props;
    const { user_course, user_practice_info } = this.state;
    const courseList = user_course.map((course, i) => {
      return <Slide in={true} direction="down" {...(true ? { timeout: 1500 } : {})}>
        <Course id={course.id} name={course.course_name} backgroundImage={course.background_image} rating={course.rating_value} />
      </Slide>
    });

    return (
      <>
        {this.state.isLoading ? (
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
              loading={this.state.isLoading}
            />
          </div>
        ) : (
            <React.Fragment>
              <Grid
                container
                spacing={2}
                style={{ height: "100%", maxHeight: "352px" }}
              >
                <Grid item xs={12} sm={4} md={4}>
                  <Paper
                    style={{
                      height: "351px",
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Grid container direction="row">
                      <Grid item xs={12} md={12} sm={12}>
                        <Grid item xs={12} md={12} sm={12}>
                          <Box display="flex" p={1} bgcolor="grey.300">
                            <Box mr={1} mt={1} flexGrow={1}>
                              <PersonIcon fontSize="large" />
                            </Box>
                            <Box mt={1} flexGrow={6}>
                              <Typography variant="h5">Thông tin cá nhân</Typography>
                            </Box>
                            <Box>
                              <IconButton color="primary" aria-label="Edit">
                                <EditIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}>
                          <Grid container xs={12}>
                            <Grid item xs={4} md={4} sm={4} borderColor="grey.500">
                              <Box p={1}>
                                <CardMedia
                                  component="img"
                                  alt="Contemplative Reptile"
                                  height="100"
                                  src={this.props.user.avatar}
                                  title="Contemplative Reptile"
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={8} md={8} sm={8} borderColor="grey.500">
                              <Grid item container xs={12} md={12} sm={12}>
                                <Typography noWrap variant="overline">
                                  Họ và tên: {this.props.user.lastname}{" "}
                                  {this.props.user.firstname}
                                </Typography>
                              </Grid>
                              <Grid item container xs={12} md={12} sm={12}>
                                <Typography noWrap variant="overline">Email: {this.props.user.email}</Typography>
                              </Grid>
                              <Grid item container xs={12} md={12} sm={12} zeroMinWidth>
                                <Typography noWrap variant="overline">Điểm: {this.props.user.codepoint}</Typography>
                              </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{ marginLeft: 4, textAlign: "center" }}
                      >
                        Bạn sẽ nhận được chứng chỉ nếu số đậu của bạn lớn hơn{" "}
                        {this.state.review_point}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12}>
                      <Box p={2}>
                        {this.renderButtonCertificate(this.state.certificateViewStart)}
                      </Box>
                    </Grid>
                    </Grid>
                  </Paper>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Paper
                  style={{
                    minHeight: 350,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <Grid container>
                    <Grid item container style={{ flexGrow: 1 }}>
                      <Box p={2}>
                        <Typography noWrap variant="h6">Học tập</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box p={2}>
                    <Grid container spacing={2}>
                      {courseList.length === 0 ?
                        <Box p={1}>
                          <Typography variant="h3">Bạn chưa tham gia khóa học nào</Typography>
                        </Box>
                        :
                        courseList
                      }
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Dialog
                maxWidth={false}
                open={this.state.openDialogCertificate}
                onClose={this.handleDialogCertificateClose}
                aria-labelledby="customized-dialog-title"
              >
                {" "}
                {this.state.isLoadingCert === true ? (
                  <div
                    className="sweet-loading"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "200px",
                      height: "200px",
                      overflow: "hidden"
                    }}
                  >
                    <HashLoader
                      sizeUnit={"px"}
                      size={50}
                      color={"#AEA8A8"}
                      loading={this.state.isLoadingCert}
                    />
                  </div>
                ) : (
                    this.renderDialog(this.state.certificateViewStart)
                  )}
              </Dialog>
              </Grid>
            <Box mt={2}>
              <Grid container xs={12}>
                <Grid item xs={12}>
                  <Practice user_practice_info={user_practice_info} />
                </Grid>
              </Grid>
            </Box>
            </React.Fragment>
    )
  }
      </>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  errors: state.rootReducer.errors,
  user: state.rootReducer.user
});

export default withStyles(null, { withTheme: true })(
  connect(mapStateToProps, {})(PrintBody)
);
