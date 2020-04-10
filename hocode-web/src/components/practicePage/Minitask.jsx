import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
// import Avatar from '@material-ui/core/Avatar'
import { Link } from "react-router-dom";
import StarIcon from '@material-ui/icons/Star';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import DoneIcon from '@material-ui/icons/Done';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Slide from '@material-ui/core/Slide';

class Minitask extends Component {

    renderLevel = (level) => {
        if (level === "easy") {
            return <Chip size="small" label="Đơn giản" style={{ backgroundColor: "#77C148", color: "white" }} />
        } else if (level === "medium") {
            return <Chip size="small" label="Trung bình" style={{ backgroundColor: "#42A5F5", color: "white" }} />
        } else if (level === "hard") {
            return <Chip size="small" label="Phức tạp" style={{ backgroundColor: "#FF7043", color: "white" }} />
        }
    }

    renderStatus = (status) => {
        if (status === "done") {
            return <DoneIcon fontSize="medium" style={{ color: "#449D44" }} />;
        } else if (status === "tried") {
            return <HelpOutlineIcon fontSize="medium" style={{ color: "#0088CC" }} />
        } else if (status === "normal") {
            return "";
        }
    }
    render() {
        const { minitask, index } = this.props;
        return (
            <React.Fragment>
                <Slide in={true} direction="right" {...(true ? { timeout: 1550 } : {})}>
                    <Grid item xs={6}>
                        <Paper>
                            <Grid style={{backgroundColor:""}} borderRadius={16} container xs={12} justify="center" alignItems="center">
                                <Grid xs={1}>
                                    <Box p={1} ml={1}>
                                        {this.renderStatus(minitask.status)}
                                    </Box>
                                </Grid>
                                <Grid xs={1}>
                                    <Box p={2}>
                                        <Typography variant="h6">
                                            {index + 1}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid xs={5}>
                                    <Box p={1}>
                                        <Link to={`/minitask/${minitask.id}`} style={{ textDecoration: 'none' }}>
                                            <Typography variant="h6" style={{color:"#0088CC"}}>
                                                {minitask.mini_task_name}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Grid>
                                <Grid xs={2}>
                                    <Box p={1}>
                                        {this.renderLevel(minitask.level)}
                                    </Box>
                                </Grid>
                                <Grid xs={3}>
                                    <Box display="flex" justifyContent="flex-end" p={1}>
                                        <Box>
                                            <StarBorderRoundedIcon fontSize="large" style={{ cursor: "pointer", }} onClick={() => { console.log("helo") }} />
                                            <StarIcon fontSize="large" style={{ cursor: "pointer", color: "#FCB829" }} onClick={() => { console.log("helo") }} />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            {/* <Box display="flex" justifyContent="center">
                            <Box p={1}>
                                <div style={{ position: "relative" }}>
                                    <img style={{ position: "absolute", zIndex: 1, borderRadius: '50%' }} width="50px"
                                        src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/level-avatars/User-05.svg?v=3" alt="" srcset="" />
                                    <img width="44px" height="45px" style={{ borderRadius: '50%', marginLeft: 3, marginTop: 1 }}
                                        src="https://codelearnstorage.s3.amazonaws.com/CodeCamp/CodeCamp/Upload/Avatar/f52dd2000202428db182bacf9e92ab3c.png" alt="Duy" />
                                </div>
                            </Box>
                        </Box>
                        <Box p={1} display="flex" justifyContent="center">
                            <Box>
                                <Typography variant="caption">vanduyit027@gamail.com</Typography>
                            </Box>
                        </Box> */}
                        </Paper>
                    </Grid>
                </Slide>
            </React.Fragment>
        );
    }
}

export default Minitask;