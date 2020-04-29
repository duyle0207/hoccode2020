import React, { Component } from 'react';

import './room.css';
import {
    Box,
    Grid,
    // AppBar,
    // Tabs,
    // Tab,
    Typography,
    Button,
    Divider,
    Paper,
    TextField,
    Chip,
    Avatar,
    Fade,
    CardMedia
} from "@material-ui/core";

import EqualizerIcon from '@material-ui/icons/Equalizer';
import CodeIcon from '@material-ui/icons/Code';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';

import Minitask from "./Minitask";
import UserRank from './UserRank';

import Modal from 'react-awesome-modal';
import axios from 'axios';

// import { Link } from "react-router-dom";

const minitask = {
    "id": "5d9b6ff5fe6e2b038fe5a407",
    "mini_task_name": "Số lớn nhất",
    "point_unlock": 100,
    "code_point": 200,
    "status": "done",
    "vitri": false,
    "name_func": "soLonNhat",
    "mini_task_desc": "\nViết hàm trả về tổng của hai số.\n### ví dụ\nVới `param1 = 1` và `param2 = 2`, thì output sẽ là `add(param1, param2) = 3`\n### Input/Output\n\n- **[Thời gian thực thi tối đa] 3s (java)**\n- **[input] integer param1**  \n     *ràng buộc:*  \n     `-1000 ≤ param1 ≤ 1000`  \n- **[input] integer param2**  \n     *ràng buộc:*  \n     `-1000 ≤ param2 ≤ 1000`\n- **[output] integer**  \n     - Tổng của 2 input\n\n[Java] Syntax Tips  \n```\n// Prints help message to the console  \n// Returns a string  \n//   \n// Globals declared here will cause a compilation error,  \n// declare variables inside the function instead!  \nString helloWorld(String name) {  \n    System.out.println(\"This prints to the console when you Run Tests\");  \n    return \"Hello, \" + name;  \n}  \n``` \n",
    "level": "hard",
    "template_code": "public int[] soLonNhat() {\n    int[] arr={5,6,7,8,9};\n    return arr;\n}",
    "unit_tests": [
        {
            "inputs": [
                {
                    "value": "1",
                    "type": "int"
                },
                {
                    "value": "2",
                    "type": "int"
                }
            ],
            "expected_output": "3"
        },
        {
            "inputs": [
                {
                    "value": "2",
                    "type": "int"
                },
                {
                    "value": "2",
                    "type": "int"
                }
            ],
            "expected_output": "4"
        }
    ],
    "task_id": "5d86f330fe6e2b31c0673b04",
    "numbers_doing": 10
}

const fight = {
    "_id": "5ea6ec54e939f21a5432ba66",
    "fight_name": "Codewar season 2",
    "numbers_std": 250,
    "fight_desc": "Codewar program season 2",
    "backgroud_img": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTH9nv6m_csHTwo-oaIKOJPreyC-KzW2DqP8EC1jnGEnluWUqBK&usqp=CAU",
    "time_start": "2019-11-11T15:19:00.352+0000",
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

class RoomDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contestStatus: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            isOpenSearchFriend: false,
            users: [],
            email: '',
            invitedUsers: []
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

    // handle search user
    handleSearchUser = (e) => {
        const email = e.target.value;
        this.setState({ email })
        axios.get(`http://localhost:8081/api/v1/curd/searchUser/${email}`).then(res => {
            this.setState({
                users: res.data,
            });
        });
    }

    headerLeaderBoard = () => {
        return <Grid container xs={12} wrap="nowrap" spacing={2}>
            <Grid item xs={1} md={1} sm={1}>
                <Typography style={{ fontWeight: 700, fontSize: 18 }}>#</Typography>
            </Grid>
            <Grid item xs={5} md={5} sm={5} wrap="nowrap">
                <Typography style={{ fontWeight: 700, fontSize: 18 }}>Tên đăng nhập</Typography>
            </Grid>
            <Grid item xs={3} md={3} sm={3}>
                <Typography style={{ fontWeight: 700, fontSize: 18 }}>Điểm</Typography>
            </Grid>
            <Grid item xs={3} md={3} sm={3}>
                <Typography style={{ fontWeight: 700, fontSize: 18 }}>Thời gian</Typography>
            </Grid>
        </Grid>;
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

    handleOpenSearchUserModal = () => {
        this.setState({ isOpenSearchFriend: true });
    }

    checkUserInInvitedList = (id) => {
        const invitedUsers = this.state.invitedUsers;
        console.log(invitedUsers);
        for (var i = 0; i < invitedUsers.length; i++) {
            if (invitedUsers[i].id === id) return false;
        }
        return true;
    }

    handleInviteUser = (user) => {
        const invitedUsers = this.state.invitedUsers;
        console.log(this.checkUserInInvitedList(user.id));
        if (this.checkUserInInvitedList(user.id)) {
            invitedUsers.push(user);
            this.setState({ invitedUsers });
        } else {
            alert("already");
        }
    }

    handleDeleteUserFromInvitedList = (id) => {
        const invitedUsers = this.state.invitedUsers;
        var i = -1;

        invitedUsers.forEach((user, index) => {
            if (user.id === id) {
                i = index;
            }
        });
        if (i !== -1) {
            invitedUsers.splice(i, 1);
            this.setState({ invitedUsers });
        }
    }

    closeModalError = () => {
        this.setState({ isOpenSearchFriend: false });
    }

    render() {
        const { contestStatus, days, hours, min, sec, isOpenSearchFriend, email, users, invitedUsers } = this.state;
        let timer;
        if (contestStatus === 0) {
            timer = <Box display="flex">
                <Box mx={2} display="flex" color="#f44336">
                    <Typography style={{ fontSize: 18, fontWeight: 550 }} gutterBottom>
                        Đang diển ra
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
                    <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                        Kết thúc
                    </Typography>
                </Box>
                <Box mb={1} display="flex" color="#757575">
                    <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                        {new Date(fight.time_end).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
                    </Typography>
                </Box>
            </React.Fragment>
        }

        const userList = users.map((user, index) => {
            return <Box>
                <Divider />
                <Box display="flex" p={1} onClick={() => this.handleInviteUser(user)}>
                    <Box mx={1}>
                        <Avatar alt="Ảnh đại diện" src={(user.socialAccount === "google" || user.socialAccount === "facebook") ? user.avt : user.avatar} />
                    </Box>
                    <Box mx={1}>
                        <Typography variant="overline">{user.email}</Typography>
                    </Box>
                </Box>
                <Divider />
            </Box>;
        });

        const invitedUserList = invitedUsers.map((user, index) => {
            return <Fade in={true}><Box p={1}>
                <Chip
                    avatar={<Avatar alt="Ảnh đại diện" src={(user.socialAccount === "google" || user.socialAccount === "facebook") ? user.avt : user.avatar} />}
                    label={user.email}
                    variant="outlined"
                    onDelete={() => this.handleDeleteUserFromInvitedList(user.id)}
                />
            </Box>
            </Fade>;
        });

        return (
            <React.Fragment>
                <Modal visible={isOpenSearchFriend} style={{ width: 1000, height: 1000 }} effect="fadeInDown" onClickAway={() => this.closeModalError()}>
                    <Grid container xs={12}>
                        <Grid item xs={7} md={7} sm={7}>
                            <Box p={2} style={{ width: 588, height: 500, overflowY: "auto", overflowX: "hidden" }}>
                                <Box p={1}>
                                    <TextField id="outlined-basic" label="Tìm kiếm bạn bè" variant="outlined" fullWidth
                                        value={email}
                                        onChange={this.handleSearchUser}
                                        InputProps={{
                                            startAdornment: <SearchIcon position="start"></SearchIcon>,
                                        }}
                                    />
                                </Box>
                                <Box p={1}>
                                    {userList}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={5} md={5} sm={5}>
                            <Box p={2} style={{ width: 500, height: 500, overflowY: "auto", overflowX: "hidden" }}>
                                <Box p={1}>
                                    <Typography variant="button">Bạn bè ({invitedUserList.length})</Typography>
                                </Box>
                                <Box p={1}>
                                    {invitedUserList}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Modal>
                <Divider />
                <Grid style={{ backgroundColor: "white", borderRadius: 8 }} container xs={12} justify="center">
                    <Grid xs={12} sm={3} md={3}>
                        <Box p={2} display="flex" justifyContent="center">
                            <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="200"
                                src="https://vnreview.vn/image/14/91/03/1491033.jpg"
                                title="Contemplative Reptile"
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={9} md={9}>
                        <Box mx={2} mt={2} display="flex">
                            <Typography style={{ fontSize: 35, fontWeight: 400 }}>
                                Sasuke
                            </Typography>
                        </Box>
                        <Box mx={2} display="flex">
                            <Typography style={{ fontSize: 20, fontWeight: 300 }}>
                                Using their chosen programming language, everyone will write aprogram to solve the problem given by the Organizing Committee.
                                Using their chosen programming language, everyone will write aprogram to solve the problem given by the Organizing Committee.
                            </Typography>
                        </Box>
                        <Box p={2} display="flex">
                            <Grid container xs={12}>
                                <Grid item xs={2}>
                                    <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                                        30/40 thí sinh
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {timer}
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" style={{ backgroundColor: "#4FA34F", color: "white" }} onClick={this.handleOpenSearchUserModal}
                                        startIcon={<PersonAddIcon style={{ color: "white" }} />}>
                                        <Typography style={{ color: "white", fontWeight: 500 }}>
                                            Mời bạn
                                        </Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Divider />
                {
                    contestStatus === -1 ?
                        <Box mt={2}>
                            <Grid container xs={12} spacing={1}>
                                <Grid item xs={12} md={12} sm={12}>
                                    <Paper>
                                        <Box p={1}>
                                            <Box my={1} display="flex">
                                                <Box mx={1} justifyContent="center" alignItems="center">
                                                    <Box>
                                                        <EqualizerIcon fontSize="large" />
                                                    </Box>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography style={{ fontWeight: 500, fontSize: 22 }}>Xếp hạng</Typography>
                                                </Box>
                                            </Box>
                                            <Box my={1} p={1}>
                                                {this.headerLeaderBoard()}
                                                <Divider />
                                                <Box my={1}>
                                                    <UserRank />
                                                    <UserRank />
                                                    <UserRank />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                        :
                        <Box mt={2}>
                            <Grid container xs={12} spacing={1}>
                                <Grid item xs={7} md={7} sm={7}>
                                    <Paper>
                                        <Box p={1}>
                                            <Box my={1} mx={1} display="flex">
                                                <Box mx={1} justifyContent="center" alignItems="center">
                                                    <Box>
                                                        <CodeIcon fontSize="large" />
                                                    </Box>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography style={{ fontWeight: 500, fontSize: 22 }}>Thách thức</Typography>
                                                </Box>
                                            </Box>
                                            <Box my={1}>
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={5} md={5} sm={5}>
                                    <Paper>
                                        <Box p={1}>
                                            <Box my={1} display="flex">
                                                <Box mx={1} justifyContent="center" alignItems="center">
                                                    <Box>
                                                        <EqualizerIcon fontSize="large" />
                                                    </Box>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography style={{ fontWeight: 500, fontSize: 22 }}>Xếp hạng</Typography>
                                                </Box>
                                            </Box>
                                            <Box my={1} p={1}>
                                                {this.headerLeaderBoard()}
                                                <Divider />
                                                <Box my={1}>
                                                    <UserRank />
                                                    <UserRank />
                                                    <UserRank />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                }
            </React.Fragment>
        );
    }
}

export default RoomDetail;