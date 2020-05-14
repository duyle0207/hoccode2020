import React, { Component } from 'react';
import './room.css';
import {
    Box,
    Grid,
    AppBar,
    Tabs,
    Tab,
    Typography,
    Button,
    Slide,
    CardMedia
} from "@material-ui/core";

import { Link } from "react-router-dom";

// import {
//     Pagination
// } from '@material-ui/lab';

import Room from './Room';
import AddBoxIcon from '@material-ui/icons/AddBox';
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </Typography>
    );
}

class RoomPracticePage extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            tab: 0,
            isLoading: true,
            publicFightPages: '',
            currentPublicFightPage: 0,
            privateFightPages: '',
            currentPrivateFightPage: 0,
            publicFights: [],
            privateFights: [],
            fight_user: [],
            fight_user_joined: [],
        });
    }

    componentDidMount() {
        const { currentPublicFightPage } = this.state;
        axios.get(`http://localhost:8081/api/v1/curd/fights/public/${currentPublicFightPage}/`).then(res => {
            this.setState({ publicFights: res.data });
            axios.get(`http://localhost:8081/api/v1/curd/privateFights`).then(res => {
                this.setState({ privateFights: res.data });
                axios.get(`http://localhost:8081/api/v1/curd/fightsByUser`).then(res => {
                    this.setState({ fight_user: res.data });
                    axios.get(`http://localhost:8081/api/v1/curd/getUserFight`).then(res => {
                        console.log(res.data);
                        this.setState({ fight_user_joined: res.data, isLoading: false });
                    });
                });
            });
        });
    }

    handleChangeTab = (event, newValue) => {
        this.setState({ tab: newValue });
    }

    render() {
        const { tab, publicFights, privateFights, fight_user, isLoading, fight_user_joined } = this.state;

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

        const publicFightsList = publicFights.map((fight, index) => {
            return <Slide in={true} direction="right" {...(true ? { timeout: 1500 } : {})}><Room fight={fight} index={index} /></Slide>
        });

        const privateFightsList = privateFights.map((fight, index) => {
            return <Slide in={true} direction="right" {...(true ? { timeout: 1500 } : {})}><Room fight={fight} index={index} /></Slide>
        });

        const fight_user_list = fight_user.map((fight, index) => {
            return <Slide in={true} direction="right" {...(true ? { timeout: 1500 } : {})}><Room fight={fight} index={index} isUserRoom={true} /></Slide>
        });

        const fight_user_joined_list = fight_user_joined.map((fight, index) => {
            return <Slide in={true} direction="right" {...(true ? { timeout: 1500 } : {})}><Room fight={fight} index={index} /></Slide>
        });

        return (
            <React.Fragment>
                <Grid className="banner" container xs={12} justify="center">
                    <Grid xs={12} sm={6} md={6}>
                        <Box mt={4} display="flex" justifyContent="center">
                            <img src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                // width="100%"
                                height="150px" alt="banner" />
                        </Box>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Typography style={{ fontSize: 30, fontWeight: 200, color: "#b3b3b3" }}>
                                <span style={{ fontSize: 30, fontWeight: 200, color: "#FFFFFF" }}>Chiến trường</span> Hocode
                            </Typography>
                        </Box>
                        <Box mb={4} display="flex" justifyContent="center">
                            <Typography style={{ fontSize: 18, fontWeight: 200, color: "#b3b3b3" }}>
                                Hãy cùng chiến đấu mỗi tuần cùng Hocode nhé
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box my={2} display="flex" justifyContent="center">
                    <Box flexGrow={1}>
                        {/* <Typography style={{ fontSize: 28, fontWeight: 460 }}>Chiến trường</Typography> */}
                    </Box>
                    <Box>
                        <Button variant="contained" style={{ backgroundColor: "#F1B729" }} component={Link} to={`/profile/create-contest`}
                            startIcon={<AddBoxIcon style={{ color: "white" }} />}>
                            <Typography variant="button" style={{ color: "white" }}>Tạo cuộc thi</Typography>
                        </Button>
                    </Box>
                </Box>
                {/* <Grid container xs={12}> */}
                <AppBar position="static" style={{ backgroundColor: "white", color: "black" }}>
                    <Tabs value={tab} onChange={this.handleChangeTab} aria-label="simple tabs example">
                        <Tab label="Công khai" />
                        <Tab label="Riêng tư" />
                        <Tab label={`Đã tham gia (${fight_user_joined_list.length})`} />
                        <Tab label="Cuộc thi của bạn" />
                    </Tabs>
                </AppBar>
                <TabPanel value={tab} index={0}>
                    {publicFightsList}
                    {/* <Box p={2} display="flex" justifyContent="center">
                        <Box>
                            <Pagination count={3} page={1} />
                        </Box>
                    </Box> */}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    {privateFightsList.length === 0 ?
                        <Grid container justify="center" alignContent="center">
                            <Box>
                                <CardMedia
                                    component="img"
                                    style={{ width: 200, height: 200 }}
                                    image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/code-learn/not-found.svg"
                                    title="Contemplative Reptile"
                                />
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h6">
                                        Không có dữ liệu
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        :
                        privateFightsList
                    }
                    {/* <Box p={2} display="flex" justifyContent="center">
                        <Box>
                            <Pagination count={3} page={1} />
                        </Box>
                    </Box> */}
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    {fight_user_joined_list.length === 0 ?
                        <Grid container justify="center" alignContent="center">
                            <Box>
                                <CardMedia
                                    component="img"
                                    style={{ width: 200, height: 200 }}
                                    image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/code-learn/not-found.svg"
                                    title="Contemplative Reptile"
                                />
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h6">
                                        Không có dữ liệu
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        :
                        fight_user_joined_list
                    }
                </TabPanel>
                <TabPanel value={tab} index={3}>
                    {fight_user_list.length === 0 ?
                        <Grid container justify="center" alignContent="center">
                            <Box>
                                <CardMedia
                                    component="img"
                                    style={{ width: 200, height: 200 }}
                                    image="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/code-learn/not-found.svg"
                                    title="Contemplative Reptile"
                                />
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h6">
                                        Không có dữ liệu
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        :
                        fight_user_list
                    }
                </TabPanel>
                {/* </Grid> */}
            </React.Fragment>
        );
    }
}

export default RoomPracticePage;