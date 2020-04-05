import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";

import UserRank from "./UserRank";
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";
import Fade from '@material-ui/core/Fade';
import { connect } from "react-redux";

class CourseLeaderBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            courseLeaderBoard: [],
            isLoading: true,
            currentUser: {}
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8081/api/v1/auth/getCourseLeaderBoard/${this.props.courseId}`).then(res => {
            this.setState({ courseLeaderBoard: res.data, isLoading: false, currentUser: this.props.user });
        });
    }

    render() {
        const { isLoading, courseLeaderBoard } = this.state;
        const leaderBoard = courseLeaderBoard.map((user, index) => {
            return <UserRank user={user} rank={index + 1} isCurrentUser={user.user_info.id === this.props.user.id} />
        });
        return (
            <React.Fragment>
                {
                    isLoading ?
                        <React.Fragment>
                            <div
                                className="sweet-loading"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: "50vh"
                                }}
                            >
                                <HashLoader
                                    sizeUnit={"px"}
                                    size={50}
                                    color={"#AEA8A8"}
                                    loading={isLoading}
                                />
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Fade in={!isLoading} {...(true ? { timeout: 1000 } : {})}>
                                <Box bgcolor="white" boxShadow={2} mb={3}>
                                    <Box display="flex" fontStyle="italic">
                                        <Box p={1} style={{ width: '10%' }} >
                                            <Typography gutterBottom variant="h6" component="h2">
                                                #
                                            </Typography>
                                        </Box>
                                        <Box p={1} style={{ width: '36%' }}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                Tên người dùng
                                            </Typography>
                                        </Box>
                                        <Box p={1} style={{ width: '30%' }}>
                                            <Typography gutterBottom variant="h6" component="h2">
                                                Điểm
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider light />
                                    {courseLeaderBoard.length!==0 ? leaderBoard : <Typography variant="caption">Chưa có người dùng nào tham gia</Typography>}
                                </Box>
                            </Fade>
                        </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.rootReducer.user
})


export default connect(mapStateToProps, null) (CourseLeaderBoard);