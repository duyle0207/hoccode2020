import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import User from './User';
import TopUser from './TopUser';
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import ShowChartIcon from '@material-ui/icons/ShowChart';

class leaderboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            generalLeaderBoard: [],
            isLoadingData: true,
            topUser: [],
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8081/api/v1/getGeneralLeaderBoard").then(res => {
            const generalLeaderBoard = res.data;
            const topUser = this.state.topUser;
            for (var i = 0; i < 3; i++) {
                topUser.push(generalLeaderBoard[i]);
            }
            this.setState({ generalLeaderBoard, topUser, isLoadingData: false });
        });
    }

    render() {
        let leaderBoard = this.state.generalLeaderBoard.map((user, rank) => (<User rank={rank + 1} user={user} />));
        let { isLoadingData, topUser } = this.state;
        return (
            <div style={{ width: "100%", height: "100%" }}>
                {isLoadingData ?
                    <div style={{ display: 'flex', alignItems: "center", justifyContent: 'center', width: '100%', height: "100%" }}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Box>
                                <HashLoader
                                    sizeUnit={"px"}
                                    size={50}
                                    color={"#AEA8A8"}
                                    loading={isLoadingData}
                                />
                            </Box>
                        </Box>
                    </div>
                    :
                    <Grid
                        className="containerMain"
                        style={{
                            height: "inherit",
                            width: "100%",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover"
                        }}
                    >
                        <Grid
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                paddingTop: 0,
                                height: "inherit",
                                backgroundColor: "whitesmoke"
                            }}
                        >
                            <Grid container className="header-homepage" style={{ backgroundColor: "white" }}>
                                <Grid
                                    className="HeaderLeftHome"
                                    item
                                    xs={12}
                                    md={4}
                                    sm={4}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Box p={2}>
                                        <Link to="/profile">
                                            <img
                                                src={process.env.PUBLIC_URL + "/logo.png"}
                                                alt=""
                                                style={{ height: "80px" }}
                                            ></img>
                                        </Link>
                                    </Box>
                                </Grid>
                                <Grid
                                    className="HeaderRightHome"
                                    item
                                    xs={12}
                                    md={8}
                                    sm={8}
                                    container
                                >
                                    <Grid item>
                                        <Link
                                            to="/searchcert"
                                            style={{ textDecoration: "none", marginLeft: "30px" }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#2b2b2b",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    boxShadow: "none",
                                                    fontSize: "16px",
                                                    paddingLeft: "20px",
                                                    paddingRight: "20px",

                                                    // width: "155px",
                                                }}
                                                startIcon={<SearchIcon />}
                                                variant="contained"
                                            >
                                                Tra Chứng Chỉ
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <Link
                                            to="/leaderboard"
                                            style={{ textDecoration: "none", marginLeft: "30px" }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#6589F9",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    boxShadow: "none",
                                                    fontSize: "16px",
                                                    paddingLeft: "20px",
                                                    paddingRight: "20px",

                                                    // width: "155px",
                                                }}
                                                startIcon={<ShowChartIcon />}
                                                variant="contained"
                                            >
                                                Xếp hạng
                                            </Button>
                                        </Link>
                                    </Grid>

                                    <Grid item>
                                        <a
                                            href="/login"
                                            style={{ textDecoration: "none", marginLeft: "30px" }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#2196f3",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    fontSize: "16px",
                                                    boxShadow: "none",
                                                    width: "125px"
                                                }}
                                                variant="contained"
                                            >
                                                Đăng nhập
                                    </Button>
                                        </a>
                                    </Grid>
                                    <Grid item>
                                        <Link
                                            to="/signup"
                                            style={{ textDecoration: "none", marginLeft: "30px" }}
                                        >
                                            <Button
                                                style={{
                                                    background: "#7bccd5",
                                                    color: "white",
                                                    fontWeight: 600,
                                                    boxShadow: "none",
                                                    fontSize: "16px",
                                                    width: "125px"
                                                }}
                                                variant="contained"
                                            >
                                                Đăng ký
                                    </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box display="flex" mt={2} justifyContent="flex-start" >
                                <Container fixed>
                                    <Typography gutterBottom variant="h4">
                                        Bảng xếp hạng
                                    </Typography>
                                    <Divider />
                                </Container>
                            </Box>
                            <Box p={3}>
                                <Container fixed>
                                    <Grid item xs={12}>
                                        <Grid container justify="center" spacing={1}>
                                            <TopUser leader_board_type="general" user={topUser[1]} rank={2 + "nd"} />
                                            <TopUser leader_board_type="general" user={topUser[0]} rank={1 + "st"} />
                                            <TopUser leader_board_type="general" user={topUser[2]} rank={3 + "rd"} />
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                            <Container fixed>
                                <Box bgcolor="white" boxShadow={2} p={1} mb={3}>
                                    <Box display="flex" fontStyle="italic">
                                        <Box p={1} style={{ width: '33%' }} >
                                            <Typography gutterBottom variant="h6" component="h2">
                                                #
                                            </Typography>
                                        </Box>
                                        <Box p={1} style={{ width: '35%' }}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                Tên
                                        </Typography>
                                        </Box>
                                        <Box p={1} style={{ width: '30%' }}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                Điểm
                                        </Typography>
                                        </Box>
                                    </Box>
                                    <Divider light />
                                    {leaderBoard}
                                </Box>
                            </Container>
                        </Grid>
                    </Grid>
                }
            </div>
        );
    }
}

export default leaderboardPage;
