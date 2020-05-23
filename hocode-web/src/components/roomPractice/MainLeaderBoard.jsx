import React, { Component } from 'react';
import {
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, Typography, Divider,
    Box, CardMedia, Paper,
    Slide, Fade
} from "@material-ui/core";
import MinitaskBoard from "./MinitaskBoard";
import MinitaskBoardInfo from "./MinitaskBoardInfo";
import ShowChartIcon from '@material-ui/icons/ShowChart';
import { matchPath } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import TopUser from "../leaderboard/TopUser";

import { connectWebSocket, sendMsg } from "../../websocket";

class MainLeaderBoard extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            fight: {},
            leaderBoard: [],
            fight_minitasks: [],
            contestStatus: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            isLoading: true,
        });
    }

    async componentDidMount() {
        var id = this.getParams(this.props.location.pathname).id;
        await Promise.all([
            // Fight ID
            connectWebSocket((msg) => {
                // alert("hello")
                console.log(msg.data);
                var data = JSON.parse(msg.data);
                if (data.message === "get-leader-board") {
                    console.log("get leader board change");
                    this.setState({
                        leaderBoard: data.leader_board,
                    })
                }
            }),
            axios.get(`http://localhost:8081/api/v1/curd/fights/${id}`).then(res => {
                this.setState({ fight: res.data }, () => {
                    var code;
                    const { fight } = this.state;
                    if ((new Date() < new Date(fight.time_start))) {
                        code = -1;
                    }
                    if ((new Date() > new Date(fight.time_start)) && (new Date() < new Date(fight.time_end))) {
                        // Đang diển ra
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
                })
            }),
            axios.get(`http://localhost:8081/api/v1/curd/fights/${id}`).then(user => {
                const fight = user.data;
                console.log(fight);
                this.setState({
                    fight
                });
            }),
            axios.get(`http://localhost:8081/api/v1/curd/user-fight-leader-board/${id}`).then(user => {
                const users_fight = user.data;
                console.log(users_fight);
                this.setState({
                    leaderBoard: user.data,
                    isLoading: false,
                });
            }),
            axios.get(`http://localhost:8081/api/v1/curd/listminitaskfight/${id}`).then(user => {
                const fight_minitasks = user.data;
                this.setState({ fight_minitasks })
            }),
        ]);
    }

    send = () => {

        const id = this.getParams(this.props.location.pathname).id;

        console.log("send");

        sendMsg(JSON.stringify({
            fight_id: id,
            user_id: "",
            minitask_id: "",
            point: 0,
            request: "get-leader-board",
        }))
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

    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    getParams = pathname => {
        const fight = matchPath(pathname, {
            path: `/profile/fight-leader-board/:id`
        });
        return (fight && fight.params) || {};
    };

    renderCodingTime = (miliSec) => {
        var seconds = Math.floor((miliSec / 1000) % 60),
            minutes = Math.floor((miliSec / (1000 * 60)) % 60),
            hours = Math.floor((miliSec / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    renderRank = (rank) => {
        if (rank === 1) {
            return <CardMedia
                style={{
                    width: 45,
                    height: 40
                }}
                image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/landing/1st.png"
                title="Contemplative Reptile"
            />
        } else if (rank === 2) {
            return <CardMedia
                style={{
                    width: 45,
                    height: 40
                }}
                image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/landing/2nd.png"
                title="Contemplative Reptile"
            />
        } else if (rank === 3) {
            return <CardMedia
                style={{
                    width: 45,
                    height: 40
                }}
                image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/landing/3rd.png"
                title="Contemplative Reptile"
            />
        } else {
            return <Typography noWrap style={{ fontSize: 15, fontWeight: 600 }}>
                {rank}
            </Typography>
        }
    }

    renderFightUserMinitask = (minitasks) => {
        const result = minitasks.map((minitask) => {
            return <MinitaskBoardInfo status={minitask.status} point={minitask.point} tried={minitask.tried} />
        });
        return result;
    }

    render() {

        const { leaderBoard, fight_minitasks, fight, contestStatus, days, hours, min, sec, isLoading } = this.state;

        const fight_minitask_list = fight_minitasks.map((minitask, index) => {
            return <MinitaskBoard minitask={minitask} index={index} />
        });

        let timer;
        if (contestStatus === 0) {
            timer = <Box display="flex">
                <Box mx={2} display="flex" color="#f44336">
                    <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                        Còn lại
                    </Typography>
                </Box>
                <Box mb={1} display="flex" color="#f44336">
                    <Box order={4}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            {this.addLeadingZeros(sec) + ' giây '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={3}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            {this.addLeadingZeros(min) + ' phút '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={2}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            {this.addLeadingZeros(hours) + ' giờ '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={1}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            {this.addLeadingZeros(days) + ' ngày '}&nbsp;
                        </Typography>
                    </Box>
                </Box>
            </Box>
        } else if (contestStatus === -1) {
            timer = <Box display="flex">
                <Box mx={2} display="flex" color="#4caf50">
                    <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                        Sắp diển ra
                    </Typography>
                </Box>
                <Box mb={1} display="flex" color="#4caf50">
                    <Box order={4}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                            {this.addLeadingZeros(sec) + ' giây '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={3}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                            {this.addLeadingZeros(min) + ' phút '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={2}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                            {this.addLeadingZeros(hours) + ' giờ '}&nbsp;
                        </Typography>
                    </Box>
                    <Box order={1}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                            {this.addLeadingZeros(days) + ' ngày '}&nbsp;
                        </Typography>
                    </Box>
                </Box>
            </Box>
        } else if (contestStatus === 1) {
            timer = <React.Fragment>
                <Box display="flex" color="#757575">
                    <Box mx={1}>
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            Kết thúc
                        </Typography>
                    </Box>
                    <Box mb={1} display="flex" color="#757575">
                        <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                            {new Date(fight.time_end).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
                        </Typography>
                    </Box>
                </Box>
            </React.Fragment>
        }

        const userList = leaderBoard.map((user) => {
            return <TableBody>
                <TableRow >
                    <TableCell align="center">
                        <Grid container justify="center">
                            {this.renderRank(user.rank + 1)}
                        </Grid>
                    </TableCell>
                    <TableCell>
                        <Grid container>
                            <Typography noWrap style={{ fontSize: 15, fontWeight: 500 }}>
                                {user.email}
                            </Typography>
                        </Grid>
                    </TableCell>
                    {this.renderFightUserMinitask(user.fight_user_minitask)}
                    <TableCell>
                        <Grid container justify="center" xs={12}>
                            <Typography style={{ fontSize: 21, fontWeight: 500, color: "#E3524B" }}>
                                {user.point}
                            </Typography>
                        </Grid>
                        <Grid container justify="center" xs={12}>
                            <Typography style={{ fontSize: 14, fontWeight: 400, color: "#70757A", fontStyle: "Italic" }}>
                                {
                                    user.coding_time === -1 ? "00:00:00" :
                                        this.renderCodingTime(user.coding_time)
                                }
                            </Typography>
                        </Grid>
                        <Divider />
                        <Grid container justify="center" xs={12}>
                            <Typography style={{ fontSize: 12, fontWeight: 400, color: "#70757A" }}>
                                {user.tried} lần thử
                            </Typography>
                        </Grid>
                    </TableCell>
                </TableRow>
            </TableBody>

        });

        return (
            <React.Fragment>
                {
                    isLoading ?
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
                        :
                        <Grid>
                            {/* <button onClick={this.send}>Hit</button> */}
                            <Slide in={true} direction="down" {...(true ? { timeout: 1500 } : {})}>
                                <Paper>
                                    <Box p={1}>
                                        <Grid container justify="center">
                                            <Grid container xs={12} justify="center">
                                                <Box display="flex" p={2}>
                                                    <ShowChartIcon style={{ fontSize: 60, fontWeight: 250, color: "gray" }} />
                                                    <Typography style={{ fontSize: 40, fontWeight: 400, color: "#009688" }}>
                                                        {fight.fight_name}
                                                    </Typography>
                                                    <ShowChartIcon style={{ fontSize: 60, fontWeight: 250, color: "gray" }} />
                                                </Box>
                                            </Grid>
                                            <Grid container xs={12} justify="center">
                                                <Box display="flex">
                                                    {timer}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Slide>
                            {/* <Divider /> */}
                            <Box>
                                <Grid container justify="center" spacing={1}>
                                    <Slide in={true} direction="right" {...(true ? { timeout: 1500 } : {})}>
                                        <TopUser
                                            leader_board_type="fight"
                                            user={leaderBoard[1].user_info}
                                            user_fight_info={leaderBoard[1]}
                                            rank={2 + "nd"}
                                            coding_time={
                                                leaderBoard[1].coding_time === -1 ? "00:00:00" :
                                                    this.renderCodingTime(leaderBoard[1].coding_time)
                                            }
                                        />
                                    </Slide>
                                    <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                                        <TopUser 
                                            leader_board_type="fight" 
                                            user={leaderBoard[0].user_info} 
                                            user_fight_info={leaderBoard[0]} 
                                            rank={1 + "st"} 
                                            coding_time={
                                                leaderBoard[0].coding_time === -1 ? "00:00:00" :
                                                    this.renderCodingTime(leaderBoard[0].coding_time)
                                            }
                                        />
                                    </Fade>
                                    <Slide in={true} direction="left" {...(true ? { timeout: 1500 } : {})}>
                                        <TopUser 
                                            leader_board_type="fight" 
                                            user={leaderBoard[2].user_info} 
                                            user_fight_info={leaderBoard[2]} 
                                            rank={3 + "rd"} 
                                            coding_time={
                                                leaderBoard[2].coding_time === -1 ? "00:00:00" :
                                                    this.renderCodingTime(leaderBoard[2].coding_time)
                                            }
                                        />
                                    </Slide>
                                </Grid>
                            </Box>
                            <TableContainer >
                                <Slide in={true} direction="up" {...(true ? { timeout: 1500 } : {})}>
                                    <Paper>
                                        <Box p={1}>
                                            <Table aria-label="simple table">
                                                <TableHead style={{ backgroundColor: "#39B9AA" }}>
                                                    <TableRow>
                                                        <TableCell align="center">
                                                            <Typography style={{ fontSize: 15, fontWeight: 500 }}>
                                                                HẠNG
                                                        </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography style={{ fontSize: 15, fontWeight: 500 }}>
                                                                TÊN ĐĂNG NHẬP
                                                        </Typography>
                                                        </TableCell>
                                                        {fight_minitask_list}
                                                        <TableCell align="center">
                                                            <Typography style={{ fontSize: 15, fontWeight: 500 }}>
                                                                TỔNG ĐIỂM
                                                        </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {userList}
                                            </Table>
                                        </Box>
                                    </Paper>
                                </Slide>
                            </TableContainer>
                        </Grid>
                }
            </React.Fragment>
        );
    }
}

export default MainLeaderBoard;