import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Divider from '@material-ui/core/Divider';
import Minitask from './Minitask';
import axios from 'axios';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    Chart,
    PieSeries,
} from '@devexpress/dx-react-chart-material-ui';

import { Animation } from '@devexpress/dx-react-chart';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
            {value === index && <Box>{children}</Box>}
        </Typography>
    );
}

class Practice extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            user_minitask: [],
            user_minitask_favourite: [],
            isLoading: true,
            chartInfo: [],
            data: [],
            allTask: [],
            tab: 0
        });
    }

    handleChangeTab = (event, newValue) => {
        this.setState({ tab: newValue });
    }

    componentDidMount() {
        axios.get(`http://localhost:8081/api/v1/curd/getUserMinitaskPractice`).then(res => {
            console.log(res.data);
            this.setState({ user_minitask: res.data });
        });
        axios.get(`http://localhost:8081/api/v1/curd/getUserMinitaskFavouriteList`).then(res => {
            console.log(res.data);
            this.setState({ user_minitask_favourite: res.data });
        });
        axios.get(`http://localhost:8081/api/v1/curd/getChartInfo`)
            .then(res => {
                console.info(res.data)
                const chartInfo = res.data;
                const data = [
                    { key: 'Medium', value: chartInfo.medium },
                    { key: 'Hard', value: chartInfo.hard },
                    { key: 'Easy', value: chartInfo.easy },
                ];

                const allTask = [
                    { key: 'Todo', value: chartInfo.todo - (chartInfo.solved + chartInfo.attempted) },
                    { key: 'Attempted', value: chartInfo.attempted },
                    { key: 'Solved', value: chartInfo.solved },
                ];

                this.setState({
                    data,
                    allTask,
                    chartInfo,
                    isLoading: false
                }, () => {
                    console.log(this.state.data);
                    console.log(this.state.allTask);
                })
            });
    }

    renderLevel = (color, nums) => {
        return <Box style={{ position: 'relative' }} >
            <img
                component="img"
                style={{ color: "red" }}
                height="100"
                width="100"
                alt=""
                src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources-cdn/Images/cv/badge-created.svg?v=4"
            />
            <div style={{
                position: 'absolute',
                color: 'black',
                left: '50%',
                top: '28%',
                transform: 'translateX(-50%)'
            }} >
                <Box>
                    <Typography variant="h4" style={{ color: color }}>
                        {nums}
                    </Typography>
                </Box>
                <Box>
                    <FavoriteIcon style={{ color: color }} />
                </Box>
            </div>
        </Box>
    }

    renderMinitaskInfo = (level, nums) => {
        var color = "", title = "";
        if (level === "easy") {
            color = "#7BC043";
            title = "đơn giản";
        }
        else if (level === "medium") {
            color = "#F69046";
            title = "trung bình";
        }
        else if (level === "hard") {
            color = "#EE4035";
            title = "phức tạp";
        }
        return <Fade in={true} direction="left" {...(true ? { timeout: 1400 } : {})}>
            <Grid item xs={4}>
                <Box display="flex" justifyContent="center">
                    <Box>
                        {this.renderLevel(color, nums)}
                    </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                    <Box>
                        <Typography variant="overline">{nums} bài {title}</Typography>
                    </Box>
                </Box>
            </Grid>
        </Fade>
    }

    render() {
        const { user_practice_info } = this.props;
        const { user_minitask, user_minitask_favourite, isLoading, chartInfo, data: chartData, tab } = this.state;
        const minitaskList = user_minitask.map((minitask, i) => {
            return <Fade in={true} direction="right" {...(true ? { timeout: 1500 } : {})}>
                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
            </Fade>;
        });
        const user_minitask_favourite_list = user_minitask_favourite.map((minitask, i) => {
            return <Fade in={true} direction="left" {...(true ? { timeout: 1500 } : {})}>
                <Minitask minitask={minitask} name={minitask.mini_task_name} status={minitask.status} level={minitask.level} />
            </Fade>;
        });
        return (
            <Box mt={1}>
                {isLoading ?
                    <Box p={10} display="flex" alignItems="center" justifyContent="center">
                        <Box>
                            <CircularProgress />
                        </Box>
                    </Box>
                    :
                    <React.Fragment>
                        <AppBar position="static" style={{backgroundColor:"white", color: "#3B3B3B"}}>
                            <Tabs value={tab} onChange={this.handleChangeTab}
                             aria-label="simple tabs example" centered>
                                <Tab label="Luyện tập" />
                                <Tab label="Yêu thích" />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={tab} index={0}>
                            <Paper
                            // style={{
                            //     minHeight: 250,
                            //     // overflowY: "auto",
                            //     display: "flex",
                            //     flexDirection: "column"
                            // }}
                            >
                                <Grid container xs={12}>
                                    <Grid container item style={{ flexGrow: 1 }}>
                                        <Box p={2}>
                                            <Typography noWrap variant="h6" component="h1">Luyện tập</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box p={2}>
                                    <Grid container spacing={3}>
                                        {this.renderMinitaskInfo("easy", user_practice_info.easy)}
                                        {this.renderMinitaskInfo("medium", user_practice_info.medium)}
                                        {this.renderMinitaskInfo("hard", user_practice_info.hard)}
                                        {/* {this.renderMinitaskInfo("easy",(user_practice_info.total))} */}
                                    </Grid>
                                </Box>
                                <Box mx={2}>
                                    <Divider />
                                </Box>
                                <Grid container>
                                    <Grid item xs={7}>
                                        <Box p={2}>
                                            <Typography variant="h6" component="h1">Đã tham gia ({user_minitask.length})</Typography>
                                        </Box>
                                        <Box mb={2}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {minitaskList}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={5}>
                                        {/* <Box p={2}>
                                    <Typography variant="h6" component="h1">Thích ({user_minitask_favourite_list.length})</Typography>
                                </Box>
                                <Box mb={2}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            {user_minitask_favourite_list}
                                        </Grid>
                                    </Grid>
                                </Box> */}
                                        <Paper style={{ backgroundColor: "#FAFAFA" }}>
                                            <Box p={1} display="flex" justifyContent="center">
                                                <Box>
                                                    <Typography variant="h5">SỐ BÀI ĐÃ LÀM</Typography>
                                                </Box>
                                            </Box>
                                            {chartInfo.easy === 0 && chartInfo.medium === 0 && chartInfo.hard === 0 ?
                                                <Box p={1} display="flex" justifyContent="center">
                                                    <Box>
                                                        <Typography variant="button">Bạn chưa thực hiện bài thực hành nào</Typography>
                                                    </Box>
                                                </Box>
                                                :
                                                <Chart
                                                    data={chartData}
                                                >
                                                    <PieSeries
                                                        valueField="value"
                                                        argumentField="key"
                                                        innerRadius={0.6}
                                                    />
                                                    {/* <Title
                                                text="SỐ BÀI ĐÃ LÀM"
                                            /> */}
                                                    <Animation />
                                                </Chart>
                                            }
                                            <Box display="flex" justifyContent="center" p={2} alignItems="center">
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#9CCC65" }}>
                                                        Easy: {chartInfo.easy + "/" + chartInfo.total_easy}
                                                    </Typography>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#42A5F5" }}>
                                                        Medium: {chartInfo.medium + "/" + chartInfo.total_medium}
                                                    </Typography>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#FF7043" }}>
                                                        Hard: {chartInfo.hard + "/" + chartInfo.total_hard}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <Box mb={2}>
                                <Paper
                                // style={{
                                //     minHeight: 250,
                                //     // overflowY: "auto",
                                //     display: "flex",
                                //     flexDirection: "column"
                                // }}
                                >
                                    <Box p={2}>
                                        <Typography variant="h6" component="h1">Thích ({user_minitask_favourite_list.length})</Typography>
                                    </Box>
                                    {user_minitask_favourite_list.length === 0 ?
                                        <Box p={2} display="flex" justifyContent="center">
                                            <Box>
                                                <Typography variant="h2">Bạn chưa thích bài nào</Typography>
                                            </Box>
                                        </Box>
                                        :
                                        <Box p={2}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    {user_minitask_favourite_list}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    }
                                </Paper>
                            </Box>
                        </TabPanel>
                    </React.Fragment>
                }
            </Box>
        );
    }
}

export default Practice;