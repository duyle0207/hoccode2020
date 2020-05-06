import React, { Component } from 'react';
import './room.css';
import {
    Box,
    Grid,
    Typography,
    Button,
    CardMedia
} from "@material-ui/core";

import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';

import { Link } from "react-router-dom";

import PersonIcon from '@material-ui/icons/Person';

const fight = {
    "_id": "5ea6ec54e939f21a5432ba66",
    "fight_name": "Codewar season 2",
    "numbers_std": 250,
    "fight_desc": "Codewar program season 2",
    "backgroud_img": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTH9nv6m_csHTwo-oaIKOJPreyC-KzW2DqP8EC1jnGEnluWUqBK&usqp=CAU",
    "time_start": "2020-05-05T00:00:00.000+0000",
    "time_end": "2020-06-05T00:00:00.000+0000",
    "users": [

    ],
    "minitasks": [

    ],
    "user_created": "thien",
    "fight_minitask": [

    ],
    "del": false
}

class Room extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contestStatus: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        }
    }

    componentDidMount() {
        var code;
        if ((new Date() < new Date(fight.time_start))) {
            code = -1;
        }
        if ((new Date() > new Date(fight.time_start)) && (new Date() < new Date(fight.time_end))) {
            code = 0;
        }
        if ((new Date() > new Date(fight.time_end))) {
            code = 1;
        }
        this.setState({ contestStatus: code });
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(code === -1 ? fight.time_start : fight.time_end);
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    calculateCountdown(endDate) {
        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            millisec: 0,
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;

        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
    }

    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    renderJoinContestButton = () => {
        const { contestStatus } = this.state;
        if (contestStatus === 0) {
            return <Button variant="contained" style={{ backgroundColor: "#E24CE1" }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />}
                component={Link} to={`/profile/fight-detail/:id`}>
                <Typography variant="button" style={{ color: "white" }}>Chiến đấu</Typography>
            </Button>
        } else if (contestStatus === -1) {
            return <Button variant="contained" style={{ backgroundColor: "#E24CE1" }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />} component={Link} to={`/profile/fight-detail/:id`}>
                <Typography variant="button" style={{ color: "white" }}>Đăng ký ngay</Typography>
            </Button>
        } else if (contestStatus === 1) {
            return <Button variant="contained" style={{ backgroundColor: "#E24CE1" }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />} component={Link} to={`/profile/fight-detail/:id`}>
                <Typography variant="button" style={{ color: "white" }}>Đã kết thúc</Typography>
            </Button>
        }

    }

    render() {
        const { index } = this.props;

        return (
            <Box my={1} boxShadow={2} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F5F5F5" }}>
                <Grid container xs={12}>
                    <Grid item xs={12} sm={2} md={2}>
                        <Box p={2} display="flex" justifyContent="center">
                            <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="100"
                                src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                title="Contemplative Reptile"
                            />
                            {/* <img src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                width="100px"
                                height="100px" alt="banner" /> */}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Box mt={2}>
                            <Typography style={{ fontSize: 30, fontWeight: 500 }}>Sasuke</Typography>
                        </Box>
                        <Box>
                            <Typography noWrap style={{ fontSize: 15, fontWeight: 200 }}>Sasukssssssssssss
                            ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                            ssssssssssssssssssssssssssssssssssssssssssssssssse
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} sm={2} md={2} justify="center" alignItems="center">
                        <Box mx={1} display="flex" justifyContent="center" alignItems="center">
                            <PersonIcon fontSize="large" />
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography style={{ fontSize: 15, fontWeight: 450 }}>120 thí sinh</Typography>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} sm={2} md={2} justify="center" alignItems="center" direction="column">
                        {/* <Grid>
                            {timer}
                        </Grid> */}
                        <Grid>
                            {this.renderJoinContestButton()}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Room;