import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import "./certificate.css";
const styles = {};

class Certificate extends Component {
  componentDidMount() {
    // let location = this.props.location; // cant use this.props.match to get param in url, => pass 'location' from profile page and use matchparam to get param
    // const currentParams = getParams(location.pathname);
    // console.log(currentParams);
    // axios
    //   .get(
    //     `http://localhost:8081/api/v1/auth/courses/${currentParams.courseId}/tasks`
    //   )
    //   .then(res => {
    //     console.log(res.data);
    //     const tasks = res.data;
    //     let tasks1 = tasks.reverse();
    //     this.setState({ tasks: tasks1, isLoading: false });
    //   });
    /* setTimeout(()=>{
            console.log(this.state.tasks)
        },2000)*/
  }
  render() {
    // const { classes } = this.props;
    const Certificate = this.props.Certificate;

    //   const { isLoading } = this.state;
    return (
      <Grid
        style={{
          minWidth: "1000px",
          minHeight: "700px",
          background: `url("/certificateBackground.jpg") no-repeat`,
          backgroundSize: "100%",
          position: "relative"
        }}
      >
        <div  className="container">
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6" style={{marginLeft: 100, marginTop: 90}}>
                <img src="../logo_HCMUTE.png" alt="" height="95" width="80" />
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6" style={{position: 'absolute',right: 100, top: 110}}>
                <img src="../logo.png" alt="" height="50" width="110" />
            </div>
          </div>
        </div>
        
        <Grid
          container
          style={{
            justifyContent: "center",
           
            position: "absolute",
            top:"37%"
          }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <p
              style={{ fontFamily: `'Dancing Script', cursive`, fontSize: 40, margin:"15px 0px", textAlign: "center",}}
            >
              {Certificate.user === undefined ?"":Certificate.user.lastname} {Certificate.user === undefined ?"":Certificate.user.firstname}
            </p>
          </Grid>
          <Grid item xs={12} sm={12} md={12} style={{margin:"0px 135px"}}>
            {" "}
            
            <div><p style={{ fontFamily: `'Dancing Script', cursive`, fontSize:30,margin:"20px 0px", textAlign:"center"}}>For successfully completion of Java program following Hocode qualification .</p></div>
            <div><p style={{ margin:"20px 0px", textAlign:"center",textTransform:"uppercase",fontWeight:"bold",fontSize:20}}>ID:  {Certificate.cert === undefined ?"":Certificate.cert.search_id}</p></div>
          </Grid>
        </Grid>
        <Grid style={{position:"absolute",left:"22%",bottom:"14%",transform:"translateX(-50%)"}}>
        {Certificate.cert === undefined ?"":new Date(Certificate.cert.timestamp).toLocaleDateString()}
        </Grid>
        <Grid style={{position:"absolute",right:"20%",bottom:"10%",transform:"translateX(50%)"}}>
        {Certificate.config === undefined ?"": <img src={Certificate.config.electronic_signature} style={{height:50, marginBottom:"20px"}} alt="electronic_signature"/>}
           
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  errors: state.rootReducer.errors,
  user: state.rootReducer.user
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, {})(Certificate)
);
