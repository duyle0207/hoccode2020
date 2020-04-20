import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    PieSeries,
} from '@devexpress/dx-react-chart-material-ui';

import { Animation } from '@devexpress/dx-react-chart';

import Minitask from './Minitask';
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';
import Fade from '@material-ui/core/Fade';

class HeaderPracticePage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            allTask: [],
            minitaskList: [],
            page: 1,
            chartInfo: [],
            isLoadingData: true,
            totalPage: 0,
            searchKeyWord: "",
            status: '',
            level: '',
            tempData: [],
            isLoadingFilterData: false,
        };
    }

    componentDidMount = () => {
        this.setState({isLoadingFilterData: true})
        axios.get(`http://localhost:8081/api/v1/curd/getAllMinitask/${this.state.page - 1}`)
            .then(res => {
                console.log(res.data);
                this.setState({ minitaskList: res.data, tempData: res.data, isLoadingFilterData:false });
            });
        axios.get(`http://localhost:8081/api/v1/curd/getTotalMinitask`)
            .then(res => {
                console.log(res.data);
                this.setState({ totalPage: res.data%16===0 ? Math.floor(res.data / 16): Math.floor(res.data / 16) + 1});
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
                    isLoadingData: false
                }, () => {
                    console.log(this.state.data);
                    console.log(this.state.allTask);
                })
            });
    }

    handleChangePage = (event, value) => {
        this.setState({ isLoadingData: true });
        axios.get(`http://localhost:8081/api/v1/curd/getAllMinitask/${value - 1}`)
            .then(res => {
                console.log(res.data);
                this.setState({ minitaskList: res.data, page: value, isLoadingData: false });
            });
    }

    componentWillUpdate() {
        // const { searchKeyWord, status, level } = this.state;
        // if (searchKeyWord.trim() === "" && status === "" && level === "") {
        //     this.setState({minitaskList: this.state.tempData});
        // } else {
        //     // this.setState({isFilter: true});
        // }
    }

    handleChangeStatus = (event) => {
        this.setState({ isLoadingFilterData: true });
        axios.get(`http://localhost:8081/api/v1/curd/searchMinitasksPracticePage/${this.state.searchKeyWord}/${event.target.value}/${this.state.level}/`).then(res => {
            console.log(res.data);
            this.setState({ status: event.target.value, minitaskList: res.data, isLoadingFilterData: false });
        });
    }

    handleChangeLevel = (event) => {
        this.setState({ isLoadingFilterData: true, });
        axios.get(`http://localhost:8081/api/v1/curd/searchMinitasksPracticePage/${this.state.searchKeyWord}/${this.state.status}/${event.target.value}/`).then(res => {
            console.log(res.data);
            this.setState({ level: event.target.value, minitaskList: res.data, isLoadingFilterData: false });
        });
    }

    handleChangeKeyword = (event) => {
        this.setState({ searchKeyWord: event.target.value, isLoadingFilterData: true });
        console.log(event.target.value);
        axios.get(`http://localhost:8081/api/v1/curd/searchMinitasksPracticePage/${event.target.value}/${this.state.status}/${this.state.level}/`).then(res => {
            console.log(res.data);
            this.setState({ minitaskList: res.data, isLoadingFilterData: false });
        });
    }

    render() {
        const { data: chartData, allTask: chartAllTask, minitaskList, chartInfo, isLoadingData, page, totalPage,
            searchKeyWord, status, level, isLoadingFilterData } = this.state;

        const list = minitaskList.map((minitask, index) => {
            return <Minitask index={index} minitask={minitask} />
        })

        return (
            <React.Fragment>
                {isLoadingData ?
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
                            loading={isLoadingData}
                        />
                    </div>
                    :
                    <Box>
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={3}>
                                <Grid item xs={9}>
                                    <Box>
                                        <img src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/content/training.jpg"
                                            width="100%"
                                            height="250px" alt="banner" />
                                    </Box>
                                    <Box style={{
                                        marginTop: "-5px",
                                        backgroundColor: "#FFFFFF",
                                    }}>
                                        <Grid container direction="row" justify="center" alignItems="center">
                                            <Grid item xs={2} >
                                                <Box p={1} display="flex" justifyContent="center">
                                                    <Box>
                                                        <img src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources/Images/ChallengesIcon.svg"
                                                            width="50px" height="50px" alt="" srcset="" />
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} direction="row" justify="center" alignItems="center">
                                                <Box mx={1} display="flex" justifyContent="center">
                                                    <FormControl style={{ width: '100%' }}>
                                                        <TextField id="outlined-basic"
                                                            placeholder="Nhập nội dung tìm kiếm"
                                                            variant="outlined"
                                                            value={searchKeyWord}
                                                            onChange={this.handleChangeKeyword}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <SearchIcon />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2} direction="row" justify="center" alignItems="center">
                                                <Box mx={1} display="flex" justifyContent="center">
                                                    <FormControl variant="filled" style={{ width: "100%" }}>
                                                        <InputLabel id="demo-simple-select-filled-label">Trạng thái</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-filled-label"
                                                            id="demo-simple-select-filled"
                                                            value={status}
                                                            onChange={this.handleChangeStatus}
                                                        >
                                                            {/* <MenuItem value="">
                                                                <em>Tar</em>
                                                            </MenuItem> */}
                                                            <MenuItem value={""}>Trạng thái</MenuItem>
                                                            <MenuItem value={"done"}>Đã hoàn thành</MenuItem>
                                                            <MenuItem value={"tried"}>Chưa hoàn thành</MenuItem>
                                                            <MenuItem value={"normal"}>Chưa làm</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={2} direction="row" justify="center" alignItems="center">
                                                <Box mx={1} display="flex" justifyContent="center">
                                                    <FormControl variant="filled" style={{ width: "100%" }}>
                                                        <InputLabel id="demo-simple-select-filled-label">Cấp độ</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-filled-label"
                                                            id="demo-simple-select-filled"
                                                            value={level}
                                                            onChange={this.handleChangeLevel}
                                                        >
                                                            {/* <MenuItem value="">
                                                                <em>Tar</em>
                                                            </MenuItem> */}
                                                            <MenuItem value={""}>Cấp độ</MenuItem>
                                                            <MenuItem value={"easy"}>Đơn giản</MenuItem>
                                                            <MenuItem value={"medium"}>Trung bình</MenuItem>
                                                            <MenuItem value={"hard"}>Phức tạp</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3} direction="row" justify="center" alignItems="center">
                                                <Box display="flex" justifyContent="center">
                                                    <Box>

                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box mt={2}>
                                        {isLoadingFilterData ?
                                            <Box p={2} display="flex" justifyContent="center">
                                                <Box>
                                                    <Box>
                                                        <CircularProgress />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="overline">
                                                            Đang tải
                                                    </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            :
                                            minitaskList.length === 0 ?
                                                <Box p={5} display="flex" justifyContent="center">
                                                    <Box>
                                                        <Typography variant="h2">Không có dữ liệu</Typography>
                                                    </Box>
                                                </Box>
                                                :
                                                <Grid container xs={12} spacing={2}>
                                                    {list}
                                                </Grid>
                                        }
                                        {status === "" && level === "" && searchKeyWord.trim() === "" ?
                                            <Fade in={!isLoadingData} {...(true ? { timeout: 1400 } : {})}>
                                                <Box p={2} display="flex" justifyContent="center">
                                                    <Box>
                                                        <Pagination count={totalPage} page={page} onChange={this.handleChangePage} />
                                                    </Box>
                                                </Box>
                                            </Fade>
                                            :
                                            ""
                                        }
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box >
                                        <Paper>
                                            <Box p={1} display="flex" justifyContent="center">
                                                <Box>
                                                    <Typography variant="h5">THỐNG KÊ CHUNG</Typography>
                                                </Box>
                                            </Box>
                                            <Chart
                                                data={chartAllTask}
                                            >
                                                <PieSeries
                                                    valueField="value"
                                                    argumentField="key"
                                                />
                                                {/* <Title
                                                    text="THỐNG KÊ CHUNG"
                                                /> */}
                                                <Animation />
                                            </Chart>
                                            <Box display="flex" justifyContent="center" p={1} alignItems="center">
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#42A5F5" }}>
                                                        To do: {chartInfo.todo - (chartInfo.solved + chartInfo.attempted)}
                                                    </Typography>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#9CCC65" }}>
                                                        Solved: {chartInfo.solved + "/" + chartInfo.todo}
                                                    </Typography>
                                                </Box>
                                                <Box mx={1}>
                                                    <Typography variant="overline" style={{ color: "#FF7043" }}>
                                                        Attempted: {chartInfo.attempted}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Box>
                                    <Box mt={2}>
                                        <Paper style={{ backgroundColor: "#FAFAFA" }}>
                                            <Box p={1} display="flex" justifyContent="center">
                                                <Box>
                                                    <Typography variant="h5">SỐ BÀI ĐÃ HOÀN THÀNH</Typography>
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
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                }
            </React.Fragment>
        );
    }
}

export default HeaderPracticePage;