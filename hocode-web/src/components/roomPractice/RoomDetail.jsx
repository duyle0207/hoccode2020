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
    CardMedia,
    Slide,
} from "@material-ui/core";

import EqualizerIcon from '@material-ui/icons/Equalizer';
import CodeIcon from '@material-ui/icons/Code';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';

import Minitask from "./Minitask";
import UserRank from './UserRank';

// import Modal from 'react-awesome-modal';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar, SnackbarProvider } from 'notistack';
import { matchPath } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { connect } from "react-redux";
import Notfoundpage from './Notfoundpage';

import { connectWebSocket } from "../../websocket"
// import { Link } from "react-router-dom";

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
            invitedUsers: [],
            isLoadingSearch: false,
            fight: {},
            fight_minitask: [],
            isLoading: true,
            users_fight: [],
            isUserJoinFight: '',
        }
    }

    componentDidMount() {

        const id = this.getParams(this.props.location.pathname).id;

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
                // Get list minitask
                axios.get(`http://localhost:8081/api/v1/curd/listminitaskfight/${id}`).then(res => {
                    const fight_minitask = res.data;
                    this.setState({
                        fight_minitask,
                    }, () => {
                        axios.get(`http://localhost:8081/api/v1/curd/user-fight/${id}`).then(user => {
                            const users_fight = user.data;
                            console.log(users_fight);
                            this.setState({
                                users_fight: user.data,
                                invitedUsers: user.data,
                            }, () => {
                                axios.get(`http://localhost:8081/api/v1/curd/isUserJoinFight/${id}/`).then(isUserJoin => {
                                    console.log(isUserJoin);
                                    this.setState({
                                        isUserJoinFight: isUserJoin.data,
                                        isLoading: false
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        // Websocket
        connectWebSocket((msg)=>{
            alert("hello")
            console.log(msg.data);
        });
    }

    getParams = pathname => {
        const fight = matchPath(pathname, {
            path: `/profile/contest-detail/:id`
        });
        return (fight && fight.params) || {};
    };

    // handle search user
    handleSearchUser = (e) => {
        const email = e.target.value;
        this.setState({ email, isLoadingSearch: true }, () => {
            axios.get(`http://localhost:8081/api/v1/curd/searchUser/${email}/`).then(res => {
                this.setState({
                    users: res.data,
                    isLoadingSearch: false,
                });
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
        const { invitedUsers, users_fight, fight } = this.state;
        console.log(fight.numbers_std);
        console.log(users_fight.length);
        if (users_fight.length < fight.numbers_std) {
            if (this.checkUserInInvitedList(user.id)) {
                user.isNew = true;
                invitedUsers.push(user);
                this.setState({ invitedUsers });
            } else {
                this.props.enqueueSnackbar('Người dùng đã được mời', {
                    variant: 'warning',
                });
            }
        } else {
            this.props.enqueueSnackbar('Vượt quá số lượng người dùng cho phép', {
                variant: 'warning',
            });
        }
    }

    handleDeleteUserFromInvitedList = (deleted_user) => {
        const { invitedUsers, fight } = this.state;
        var i = -1;

        console.log(deleted_user.id);

        invitedUsers.forEach((user, index) => {
            if (user.id === deleted_user.id) {
                i = index;
            }
        });
        if (i !== -1) {
            invitedUsers.splice(i, 1);
            this.setState({ invitedUsers });
            if (!deleted_user.isNew) {
                // kick user
                axios.delete(`http://localhost:8081/api/v1/curd/kick-user-out-fight/${deleted_user.id}/${fight.id}/`).then(res => {
                    if (res.data === "ok") {
                        this.props.enqueueSnackbar('Xóa thành công', {
                            variant: 'success',
                        });
                    }
                });
            } else {
                this.props.enqueueSnackbar('Xóa thành công', {
                    variant: 'success',
                });
            }
        }
    }

    closeModalError = (e) => {
        this.setState({ isOpenSearchFriend: false });
    }

    handleJoinFight = () => {
        const { users_fight, fight } = this.state;
        if (users_fight.length < fight.numbers_std) {
            axios.post(`http://localhost:8081/api/v1/curd/jointFight/${fight.id}/`).then(res => {
                console.log(res.data);
                const { users_fight } = this.state;
                users_fight.push(res.data)
                this.setState({ isUserJoinFight: true, users_fight }, () => {
                    console.log(this.state.users_fight);
                })
                this.props.enqueueSnackbar('Đăng ký thành công', {
                    variant: 'success',
                });
            });
        } else {
            this.props.enqueueSnackbar('Vượt quá số lượng người dùng cho phép', {
                variant: 'warning',
            });
        }
    }

    renderInviteFriendButton = (user_created, contestStatus) => {
        if (user_created === this.props.user.email) {
            if (contestStatus !== 1) {
                return <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                    <Button variant="contained" style={{ backgroundColor: "#4FA34F", color: "white" }} onClick={this.handleOpenSearchUserModal}
                        startIcon={<PersonAddIcon style={{ color: "white" }} />}>
                        <Typography style={{ color: "white", fontWeight: 500 }}>
                            Mời bạn
                        </Typography>
                    </Button>
                </Fade>
            } else {
                return "";
            }
        }
    }

    inviteFriendByMail = () => {
        const { users_fight, fight } = this.state;
        console.log(users_fight);
        if (users_fight.length <= fight.numbers_std) {
            for (var i = 0; i < users_fight.length; i++) {
                if (users_fight[i]["isNew"]) {
                    if (users_fight.length <= fight.numbers_std) {
                        users_fight[i]["isNew"] = false;
                        axios.post(`http://localhost:8081/api/v1/curd/jointFight_1/${fight.id}/${users_fight[i].id}/${users_fight[i].email}/`).then(res => {
                            this.props.enqueueSnackbar(`Đã thêm ${res.data.email} vào cuộc thi!`, {
                                variant: 'success',
                            });
                        });
                        axios.post(`http://localhost:8081/api/v1/curd/invite-user`, {
                            host: this.props.user.email,
                            user: users_fight[i].email,
                            link: `http://localhost:3000/profile/contest-detail/${fight.id}`
                        }).then(res => {
                            console.log(res);
                        });
                    } else {
                        this.props.enqueueSnackbar('Vượt quá số lượng người dùng cho phép', {
                            variant: 'warning',
                        });
                    }
                }
            }
        } else {
            this.props.enqueueSnackbar('Vượt quá số lượng người dùng cho phép', {
                variant: 'success',
            });
        }
    }

    renderRegisterButton = (contestStatus, isUserJoinFight) => {
        if (!isUserJoinFight) {
            if (contestStatus !== 1) {
                return <Box>
                    <Fade in={!isUserJoinFight} {...(true ? { timeout: 1000 } : {})}>
                        <Button variant="contained" onClick={this.handleJoinFight} style={{ backgroundColor: "#4F5060" }}>
                            <Typography variant="button" style={{ color: "white" }}>Đăng ký ngay</Typography>
                        </Button>
                    </Fade>
                </Box>;
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    renderFighType = (fight_type) => {
        if(fight_type === "private") {
            return <Chip size="small" label="Riêng tư" style={{ backgroundColor: "#C24535", color: "white" }} />;
        } else if(fight_type === "public"){
            return <Chip size="small" label="Công khai" style={{ backgroundColor: "#77C148", color: "white" }} />
        }
    }

    render() {
        const { contestStatus, days, hours, min, sec, isOpenSearchFriend, email, users, invitedUsers, isLoadingSearch, fight, fight_minitask, isLoading, users_fight
            , isUserJoinFight } = this.state;

        if (isLoading) {
            return <div
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
                    loading={isLoading}
                />
            </div>
        }
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

        const userList = users.map((user, index) => {
            return <Box display="flex" p={1} onClick={() => this.handleInviteUser(user)}>
                <Chip
                    avatar={<Avatar alt="Ảnh đại diện" src={(user.socialAccount === "google" || user.socialAccount === "facebook") ? user.avt : user.avatar} />}
                    label={user.email}
                    variant="outlined"
                />
            </Box>
        });

        const invitedUserList = invitedUsers.map((user, index) => {
            return <Fade in={true}><Box p={1}>
                <Chip
                    avatar={<Avatar alt="Ảnh đại diện" src={(user.socialAccount === "google" || user.socialAccount === "facebook") ? user.avt : user.avatar} />}
                    label={user.email}
                    variant="outlined"
                    color={!user.isNew ? "" : "primary"}
                    onDelete={() => this.handleDeleteUserFromInvitedList(user)}
                />
            </Box>
            </Fade>;
        });

        const fight_minitask_list = fight_minitask.map((minitask, index) => {
            return <Slide direction="right" in={true} {...(true ? { timeout: 1000 } : {})}>
                <Minitask status={"tried"} level={minitask.level} name={minitask.mini_task_name} minitask={minitask} isUserJoinFight={isUserJoinFight} contestStatus={contestStatus} />
            </Slide>
        });

        const leaderBoard = users_fight.map((user, index) => {
            return <Fade in={true} direction="left" {...(true ? { timeout: 1000 } : {})}>
                <UserRank user={user} rank={index} isCurrentUser={this.props.user.email===user.email}/>
            </Fade>
        });

        if (!isUserJoinFight && fight.fight_type === "private" && this.props.user.email !== fight.user_created) {
            return <Slide in={true} direction="down" {...(true ? { timeout: 1000 } : {})} style={{ minWidth: 100 }}>
                <Notfoundpage/>
            </Slide>
        }

        return (
            <SnackbarProvider maxSnack={1}>
                <Grid xs={12} style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', alignItems: "flex-start" }}>
                    <Slide in={isOpenSearchFriend} direction="down" {...(true ? { timeout: 1000 } : {})} style={{ minWidth: 100 }}>
                        <Grid container xs={7} style={{ position: 'absolute', zIndex: 999 }} onClickAway={this.closeModalError}>
                            <Grid item xs={6} md={6} sm={6}>
                                <Box p={2} borderRadius={16} borderColor="grey.500" border={4} style={{ width: '100%', height: 500, overflowY: "auto", overflowX: "hidden", backgroundColor: "#FFFFFF", }}>
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
                                        {isLoadingSearch ?
                                            <Grid container justify="center" justifyContent="center">
                                                <CircularProgress />
                                            </Grid>
                                            :
                                            userList
                                        }
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={6} sm={6}>
                                <Box borderRadius={16} borderColor="grey.500" border={4} p={2} style={{ width: '100%', height: 500, backgroundColor: "#FFFFFF", overflowY: "auto", overflowX: "hidden" }}>
                                    <Grid container xs={12}>
                                        <Grid item container xs={4} md={4} sm={4}>
                                            <Box p={1}>
                                                <Typography style={{ fontWeight: 600, fontSize: 15 }}>Bạn bè ({invitedUserList.length})</Typography>
                                            </Box>
                                        </Grid>
                                        <Divider />
                                        <Grid item container xs={6} md={6} sm={6}>
                                            <Box>
                                                <Button variant="contained" style={{ backgroundColor: "#257885", color: "white" }} onClick={this.inviteFriendByMail}
                                                    startIcon={<SendIcon style={{ color: "white" }} />}>
                                                    <Typography style={{ color: "white", fontWeight: 500 }}>
                                                        Gửi
                                                    </Typography>
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item container xs={2} md={2} sm={2} justify="flex-end">
                                            <Box>
                                                <IconButton aria-label="delete" onClick={this.closeModalError}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container xs={12}>
                                        <Box p={1}>
                                            {invitedUserList}
                                        </Box>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Slide>
                    <Divider />
                    <Grid xs={12} style={{ zIndex: 1 }}>
                        <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
                            <Grid style={{ backgroundColor: "white", borderRadius: 8 }} container xs={12} justify="center">
                                <Grid xs={12} sm={3} md={3}>
                                    <Box p={2} display="flex" justifyContent="center">
                                        <CardMedia
                                            component="img"
                                            alt="Contemplative Reptile"
                                            height="200"
                                            src={fight.backgroud_img}
                                            title="Contemplative Reptile"
                                        />
                                    </Box>
                                </Grid>
                                <Grid xs={12} sm={9} md={9}>
                                    <Box mx={2} mt={2} display="flex">
                                        <Grid container xs={12}>
                                            <Grid container item xs={6} sm={6} md={6}>
                                                <Typography style={{ fontSize: 35, fontWeight: 400 }}>
                                                    {fight.fight_name} {this.renderFighType(fight.fight_type)}
                                                </Typography>
                                            </Grid>
                                            <Grid container item xs={6} sm={6} md={6} justify="flex-end" alignContent="center">
                                                {this.renderRegisterButton(contestStatus, isUserJoinFight)}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mx={2} mb={8} display="flex">
                                        <Typography style={{ fontSize: 20, fontWeight: 300 }}>
                                            {fight.fight_desc}
                                        </Typography>
                                    </Box>
                                    <Box p={2} display="flex">
                                        <Grid container xs={12}>
                                            <Grid item xs={2}>
                                                <Typography style={{ fontSize: 18, fontWeight: 550 }}>
                                                    {users_fight.length + "/" + fight.numbers_std} thí sinh
                                            </Typography>
                                            </Grid>
                                            <Grid item container xs={2} justify="center">
                                                <Typography noWrap style={{ fontSize: 18, fontWeight: 550, color: "#4F5060" }}>
                                                    Host: {fight.user_created}
                                                </Typography>
                                            </Grid>
                                            <Grid item container xs={6} justify="center" alignItems="center">
                                                <Grid>
                                                    {timer}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={2} container justify="flex-end" alignItems="center">
                                                {this.renderInviteFriendButton(fight.user_created, contestStatus)}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Fade>
                        <Divider />
                        {
                            contestStatus === -1 && this.props.user.email !== fight.user_created ?
                                <Box mt={2}>
                                    <Grid container xs={12} spacing={1}>
                                        <Fade in={true} {...(true ? { timeout: 1000 } : {})}>
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
                                                                {
                                                                    leaderBoard.length === 0 ?
                                                                        <Typography style={{ fontWeight: 200, fontSize: 18, color: "gray" }}>Chưa có người dùng tham gia</Typography> :
                                                                        leaderBoard
                                                                }
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        </Fade>
                                    </Grid>
                                </Box>
                                :
                                <Box mt={1}>
                                    <Grid container xs={12} spacing={1}>
                                        <Grid item xs={7} md={7} sm={7} disable="true">
                                            <Paper>
                                                <Box p={1}>
                                                    <Box my={1} mx={1} display="flex">
                                                        <Box mx={1} justifyContent="center" alignItems="center">
                                                            <Box>
                                                                <CodeIcon fontSize="large" />
                                                            </Box>
                                                        </Box>
                                                        <Box mx={1}>
                                                            <Typography style={{ fontWeight: 500, fontSize: 22 }}>Thách thức ({fight_minitask.length})</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box my={1}>
                                                        {
                                                            fight_minitask_list.length === 0 ?
                                                            <Typography style={{ fontWeight: 200, fontSize: 18, color: "gray" }}>Không có dữ liệu</Typography> :
                                                            fight_minitask_list
                                                        }
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
                                                            {leaderBoard}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                        }
                    </Grid>
                </Grid>
            </SnackbarProvider>
        );
    }
}

const mapStateToProps = state => ({
    user: state.rootReducer.user
});

export default withSnackbar(connect(mapStateToProps, null)(RoomDetail));