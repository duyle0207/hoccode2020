import React, { Component } from 'react';
import { lighten, withStyles } from '@material-ui/core/styles';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';

const BorderLinearProgress = withStyles({
    root: {
        height: 10,
        backgroundColor: lighten('#ff6c5c', 0.5),
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#ff6c5c',
    },
})(LinearProgress);

class UserInfo extends Component {
    render() {
        const { totalCourse, userCourse, minitaskInfo, fightInfo } = this.props;
        return (
            <React.Fragment>
                <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                    <Grid xs={12} container spacing={10}>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box>
                                <Typography variant="h4" style={{ fontSize: 20, fontWeight: 550 }}>
                                    Khóa học
                                </Typography>
                            </Box>
                            <Box mb={1}>
                                <Typography variant="h4" style={{ fontSize: 30, fontWeight: 600, color: "#3B3B3B" }}>
                                    {userCourse.length + "/" + totalCourse}
                                </Typography>
                            </Box>
                            <Box>
                                <BorderLinearProgress
                                    variant="determinate"
                                    color="secondary"
                                    value={(userCourse.length / totalCourse) * 100}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box>
                                <Typography variant="h4" style={{ fontSize: 20, fontWeight: 550 }}>
                                    Luyện tập
                            </Typography>
                            </Box>
                            <Box mb={1}>
                                <Typography variant="h4" style={{ fontSize: 30, fontWeight: 600, color: "#3B3B3B" }}>
                                    {minitaskInfo.solved + "/" + (minitaskInfo.total_easy + minitaskInfo.total_hard + minitaskInfo.total_medium)}
                                </Typography>
                            </Box>
                            <Box>
                                <BorderLinearProgress
                                    variant="determinate"
                                    color="secondary"
                                    value={(minitaskInfo.solved / (minitaskInfo.total_easy + minitaskInfo.total_hard + minitaskInfo.total_medium)) * 100}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Box>
                                <Typography variant="h4" style={{ fontSize: 20, fontWeight: 550 }}>
                                    Cuộc thi
                                </Typography>
                            </Box>
                            <Box mb={1}>
                                <Typography variant="h4" style={{ fontSize: 30, fontWeight: 600, color: "#3B3B3B" }}>
                                    {(fightInfo.total_private_joined_fight + fightInfo.total_public_joined_fight)+"/"+(fightInfo.total_private_fight + fightInfo.total_public_fight)}
                            </Typography>
                            </Box>
                            <Box>
                                <BorderLinearProgress
                                    variant="determinate"
                                    color="secondary"
                                    value={30}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Fade>
            </React.Fragment>
        );
    }
}

export default UserInfo;