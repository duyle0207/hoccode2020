import React, { Component } from 'react';
import './room.css';
import {
    Box,
    Grid,
    Typography,
    Button,
    CardMedia,
} from "@material-ui/core";

import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';

import { Link } from "react-router-dom";

import PersonIcon from '@material-ui/icons/Person';

import CreateIcon from '@material-ui/icons/Create';

import axios from 'axios';

import EventNoteIcon from '@material-ui/icons/EventNote';

import { withSnackbar, SnackbarProvider } from 'notistack';

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
        const { fight } = this.props;
        console.log(fight);
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
        const { fight } = this.props;
        if (fight.is_user_register) {
            if (contestStatus === 0 || contestStatus === -1) {
                return <Button variant="contained" style={{ backgroundColor: "#E8505B", borderRadius: 18 }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />}
                    component={Link} to={`/profile/contest-detail/${fight.id}`}>
                    <Typography variant="button" style={{ color: "white" }}>Xem chi tiết</Typography>
                </Button>
            } else if (contestStatus === 1) {
                return <Button variant="contained" style={{ backgroundColor: "#E24CE1", borderRadius: 18 }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />} component={Link} to={`/profile/contest-detail/${fight.id}`}>
                    <Typography variant="button" style={{ color: "white" }}>Đã kết thúc</Typography>
                </Button>
            }
        } else {
            if (contestStatus === 1) {
                return <Button variant="contained" style={{ backgroundColor: "#E24CE1", borderRadius: 18 }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />} component={Link} to={`/profile/contest-detail/${fight.id}`}>
                    <Typography variant="button" style={{ color: "white" }}>Đã kết thúc</Typography>
                </Button>
            } else {
                return <Button variant="contained" style={{ backgroundColor: "#E24CE1", borderRadius: 18 }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />} component={Link} to={`/profile/contest-detail/${fight.id}`}>
                    <Typography variant="button" style={{ color: "white" }}>Đăng ký ngay</Typography>
                </Button>
            }
        }
    }

    handleJoinFight = () => {
        const { fight } = this.props;
        axios.post(`http://localhost:8081/api/v1/curd/jointFight/${fight.id}/`).then(res => {
            // console.log(res.data);
            this.props.enqueueSnackbar('Đăng ký thành công', {
                variant: 'success',
            });
        });
    }

    renderContestStatus = () => {
        const { contestStatus } = this.state;
        const { fight } = this.props;
        if (contestStatus === -1) {
            return <Typography style={{ fontSize: 15, fontWeight: 400, color: "#777777" }}>
                Bắt đầu {new Date(fight.time_start).getDay() + " tháng " + new Date(fight.time_start).getMonth().toLocaleString()} <EventNoteIcon style={{ fontSize: 19 }}/>
            </Typography>
        } else if (contestStatus === 0) {
            return <Typography style={{ fontSize: 15, fontWeight: 400, color: "#439555" }}>
                Đang diển ra
            </Typography>
        } else if (contestStatus === 1) {
            return <Typography style={{ fontSize: 15, fontWeight: 400, color: "#E8505B" }}>
                Kết thúc
            </Typography>
        }
    }

    renderUserFightButton = () => {
        const { fight } = this.props;
        return <Grid container spacing={2} justify="flex-end" alignItems="flex-end">
            <Grid container justify="flex-end" alignItems="flex-end" justifyContent="center" xs={12}>
                <Button variant="contained" style={{ backgroundColor: "#E24CE1", borderRadius: 18 }}
                    startIcon={<CreateIcon style={{ color: "white" }} />} component={Link} to={`/profile/update-contest/${fight.id}`}>
                    <Typography variant="button" style={{ color: "white" }}>Chỉnh sửa</Typography>
                </Button>
            </Grid>
            <Grid container justify="flex-end" alignItems="flex-end" xs={12}>
                <Box my={1}>
                    <Button variant="contained" style={{ backgroundColor: "#E24CE1", borderRadius: 18 }} startIcon={<FilterCenterFocusIcon style={{ color: "white" }} />}
                        component={Link} to={`/profile/contest-detail/${fight.id}`}>
                        <Typography variant="button" style={{ color: "white" }}>Xem chi tiết</Typography>
                    </Button>
                </Box>
            </Grid>
        </Grid>;
    }

    render() {
        const { fight, isUserRoom } = this.props;

        return (
            <SnackbarProvider maxSnack={1}>
                <Box my={2} boxShadow={4} borderRadius={16} style={{ backgroundColor: "white" }}>
                    <Grid container xs={12}>
                        <Grid item xs={12} sm={3} md={3}>
                            <Box display="flex" justifyContent="center">
                                <CardMedia
                                    component="img"
                                    alt="Fight image"
                                    height="200"
                                    src={fight.backgroud_img}
                                    title="Fight image"
                                    style={{ borderRadius: 16 }}
                                />
                                {/* <img src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                width="100px"
                                height="100px" alt="banner" /> */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7}>
                            <Box mx={2}>
                                <Box mt={1}>
                                    <Typography style={{ fontSize: 25, fontWeight: 600, color: "#459556" }}>{fight.fight_name}</Typography>
                                </Box>
                                <Box>
                                    <Typography noWrap style={{ fontSize: 15, fontWeight: 200 }}>
                                        {fight.fight_desc}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid container item xs={12} sm={2} md={2}>
                            <Grid xs={12} container>
                                <Grid xs={12} container justify="flex-end" alignItems="flex-start">
                                    <Box mx={4} mt={2}>
                                        {this.renderContestStatus()}
                                    </Box>
                                </Grid>
                                <Grid xs={12} container justify="flex-end" alignItems="flex-start">
                                    <Box mx={4} display="flex" style={{ color: "#777777" }}>
                                        <Box mr={1} display="flex" justifyContent="center" alignItems="center">
                                            <PersonIcon fontSize="small" />
                                        </Box>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <Typography style={{ fontSize: 15, fontWeight: 400, color: "#777777" }}>{fight.numbers_std} thí sinh</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid xs={12} container justify="flex-end" alignItems="flex-end">
                                <Box mx={3} my={2}>
                                    {
                                        isUserRoom ?
                                            this.renderUserFightButton()
                                            :
                                            this.renderJoinContestButton()
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </SnackbarProvider>
        );
    }
}

export default withSnackbar(Room);