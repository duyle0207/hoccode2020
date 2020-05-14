import React, { Component } from 'react';

import {
    Box,
    Grid,
    Typography,
    // Button,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Paper,
    InputBase, Divider, Slider, IconButton,
    Table,
    Button,
    Tooltip,
    Chip,
    TableBody, TableCell, TableHead, TableRow,
    Slide,
    CardMedia
} from "@material-ui/core";

import Silde from '@material-ui/core/Slide';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import SearchIcon from '@material-ui/icons/Search';

import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import axios from "axios";

import Modal from 'react-awesome-modal';

import MDReactComponent from 'markdown-react-js';

import { withSnackbar, SnackbarProvider } from 'notistack';

class CreateRoomPage extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            start_time: new Date(),
            isStartTimeValid: true,
            start_time_error_message: "",
            end_time: new Date(),
            isEndTimeValid: true,
            end_time_error_message: "",
            minitaskBank: [],
            tempMinitaskList: [],
            fight_minitask: [],
            isLoading: true,
            minitaskDesc: "",
            open: false,
            sliderValue: [0, 200],
            sortByLevel: 40,
            isOpenError: false,
            errorMessage: "",
            // Fight field
            fight_name: "",
            numbers_std: "",
            fight_desc: "",
            backgroud_img: "",
            time_start: "",
            time_end: "",
            // validate
            isFightNameError: false,
            fight_name_error: "",
            isFightDescError: false,
            fight_desc_error: "",
            isFightBackGroundImgError: false,
            fight_backgroundImg_error: "",
            isFightNumStdError: false,
            fight_numStd_error: "",
        })
    }

    componentDidMount() {
        axios.get("http://localhost:8081/api/v1/curd/minitasks").then(res => {
            this.setState({ minitaskBank: res.data, tempMinitaskList: res.data, isLoading: false });
        });
    }

    onChangeFightName = (e) => {
        const fight_name = e.target.value;
        this.setState({ fight_name })
        if (fight_name === "") {
            this.setState({
                isFightNameError: true,
                fight_name_error: "Tên cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightNameError: false,
                fight_name_error: ""
            });
        }
    }

    onChangeFightDesc = (e) => {
        const fight_desc = e.target.value;
        this.setState({ fight_desc })
        if (fight_desc === "") {
            this.setState({
                isFightDescError: true,
                fight_desc_error: "Mô tả cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightDescError: false,
                fight_desc_error: ""
            });
        }
    }

    onChangeFightBackgroundImg = (e) => {
        const backgroud_img = e.target.value;
        this.setState({ backgroud_img })
        if (backgroud_img === "") {
            this.setState({
                isFightBackGroundImgError: true,
                fight_backgroundImg_error: "Ảnh cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightBackGroundImgError: false,
                fight_backgroundImg_error: ""
            });
        }
    }

    onChangeNumStd = (e) => {
        const numbers_std = e.target.value;
        this.setState({ numbers_std })
        if (numbers_std === "" || numbers_std <= 0) {
            this.setState({
                isFightNumStdError: true,
                fight_numStd_error: "Số lượng người tham gia không hợp lệ"
            });
        } else {
            this.setState({
                isFightNumStdError: false,
                fight_numStd_error: ""
            });
        }
    }

    renderLevelMinitaskChip(minitask) {
        if (minitask === "easy") {
            return (
                <Chip
                    style={{ background: "#76d38e", color: "white" }}
                    size="small"
                    label={"Easy"}
                />
            );
        } else if (minitask === "medium") {
            return (
                <Chip
                    style={{ background: "#1d97c6", color: "white" }}
                    size="small"
                    label={"Medium"}
                />
            );
        } else {
            return (
                <Chip
                    style={{ background: "#CB3837", color: "white" }}
                    size="small"
                    label={"Hard"}
                />
            );
        }
    }

    onChangeSearch = (event) => {
        const keyword = event.target.value;
        // console.log
        if (keyword === "") {
            axios.get("http://localhost:8081/api/v1/curd/minitasks").then(res => {
                console.log(res.data);
                this.setState({ minitaskBank: res.data, isLoading: false, tempMinitaskList: res.data });
            });
        }
        else {
            axios.get(`http://localhost:8081/api/v1/curd/searchMinitasks/${keyword}/`).then(res => {
                console.log(res.data);
                this.setState({ minitaskBank: res.data, isLoading: false, tempMinitaskList: res.data })
            });
        }
    }

    handleStartTimeChange = (e) => {
        // console.log(new Date(e._d));
        const { end_time } = this.state;
        if (new Date(end_time) - new Date(e._d) <= 0) {
            this.setState({
                start_time: new Date(e._d),
                isStartTimeValid: false,
                start_time_error_message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            })
        } else {
            this.setState({
                start_time: new Date(e._d),
                isEndTimeValid: true,
                end_time_error_message: "",
                isStartTimeValid: true,
                start_time_error_message: ""
            });
        }
    }

    handleEndTimeChange = (e) => {
        // console.log(new Date(e._d));
        const { start_time } = this.state;
        console.log(new Date(e._d) - new Date(start_time))
        if (new Date(e._d) - new Date(start_time) <= 0) {
            this.setState({
                end_time: new Date(e._d),
                isEndTimeValid: false,
                end_time_error_message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            })
        } else {
            this.setState({
                end_time: new Date(e._d),
                isEndTimeValid: true,
                end_time_error_message: "",
                isStartTimeValid: true,
                start_time_error_message: ""
            });
        }
    }

    getMinitaskDesc = (id) => {
        axios.get(`http://localhost:8081/api/v1/curd/minitasks/${id}`).then(res => {
            console.log(res.data.mini_task_desc);
            this.setState({
                minitaskDesc: res.data.mini_task_desc,
                open: true
            });
        })
    }

    closeModal() {
        this.setState({
            open: false
        });
    }

    checkFilterCondition = (minitask, sortByLevel) => {
        const code_point_Range = this.state.sliderValue;
        if (sortByLevel === "all") {
            if (minitask.code_point >= code_point_Range[0] &&
                minitask.code_point <= code_point_Range[1]) {
                return true;
            }
        }
        else if (minitask.level === sortByLevel &&
            minitask.code_point >= code_point_Range[0] &&
            minitask.code_point <= code_point_Range[1]) {
            return true;
        }
        return false;
    }

    onChangeSlider = (event, value) => {
        this.setState({
            sliderValue: value,
        }, () => {
            const level = this.state.sortByLevel;
            if (level === 10) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "easy"));
                this.setState({
                    tempMinitaskList: filterList
                });
            }
            else if (level === 20) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "medium"));
                this.setState({
                    tempMinitaskList: filterList
                });
            }
            else if (level === 30) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "hard"));
                this.setState({
                    tempMinitaskList: filterList
                });
            }
            else if (level === 40) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "all"));
                this.setState({
                    tempMinitaskList: filterList
                });
            }
        });
    }

    onChangeSort = (event) => {
        this.setState({
            tempMinitaskList: []
        }, () => {
            if (event.target.value === 10) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "easy"));
                this.setState({
                    tempMinitaskList: filterList,
                    sortByLevel: event.target.value
                });
            }
            else if (event.target.value === 20) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "medium"));
                this.setState({
                    tempMinitaskList: filterList,
                    sortByLevel: event.target.value
                });
            }
            else if (event.target.value === 30) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "hard"));
                this.setState({
                    tempMinitaskList: filterList,
                    sortByLevel: event.target.value
                });
            }
            else if (event.target.value === 40) {
                const listFilter = this.state.minitaskBank;
                const filterList = listFilter.filter(minitask => this.checkFilterCondition(minitask, "all"));
                this.setState({
                    tempMinitaskList: filterList,
                    sortByLevel: event.target.value
                });
            }
        })
    }

    // import minitask to fight_minitask
    getMinitaskFromBank = (minitask) => {
        const { fight_minitask } = this.state;
        const fight_minitask_temp = fight_minitask;
        if (this.isMinitaskExist(minitask.id)) {
            minitask["isNew"] = true
            fight_minitask_temp.push(minitask);
            this.setState({ fight_minitask: fight_minitask_temp });
        } else {

        }
    }

    // check if minitask already exist
    isMinitaskExist = (id) => {
        const { fight_minitask } = this.state;
        for (var i = 0; i < fight_minitask.length; i++) {
            if (fight_minitask.id === id) return false;
        }
        return true;
    }

    // remove minitask from fight_minitask
    removeMinitask(id) {
        const fight_minitask_temp = this.state.fight_minitask;
        var i = -1;

        fight_minitask_temp.forEach((minitask, index) => {
            if (id.isNew === true) {
                if (minitask.id === id.id) {
                    console.log(minitask.id);
                    i = index;
                }
            }
            else if (id.isNew === undefined && id.id === minitask.id) {
                // call api here

            }
        });
        console.log(i);
        if (i !== -1) {
            fight_minitask_temp.splice(i, 1);
            this.setState({ fight_minitask: fight_minitask_temp });
        }
    }

    // Validate data
    validate = async () => {
        const { fight_name, fight_desc, backgroud_img, numbers_std, end_time, start_time } = this.state;
        // Fight name
        if (fight_name === "") {
            this.setState({
                isFightNameError: true,
                fight_name_error: "Tên cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightNameError: false,
                fight_name_error: ""
            });
        }
        // Fight desc
        if (fight_desc === "") {
            this.setState({
                isFightDescError: true,
                fight_desc_error: "Mô tả cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightDescError: false,
                fight_desc_error: ""
            });
        }
        // Fight background img
        if (backgroud_img === "") {
            this.setState({
                isFightBackGroundImgError: true,
                fight_backgroundImg_error: "Ảnh cuộc thi không được để trống"
            });
        } else {
            this.setState({
                isFightBackGroundImgError: false,
                fight_backgroundImg_error: ""
            });
        }
        // Fight nums std
        if (numbers_std === "" || numbers_std <= 0) {
            this.setState({
                isFightNumStdError: true,
                fight_numStd_error: "Số lượng người tham gia không hợp lệ"
            });
        } else {
            this.setState({
                isFightNumStdError: false,
                fight_numStd_error: ""
            });
        }
        // Fight start time, end time
        if (new Date(end_time) - new Date(start_time) <= 0) {
            this.setState({
                start_time: new Date(start_time),
                isStartTimeValid: false,
                start_time_error_message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            })
        } else {
            this.setState({
                start_time: new Date(start_time),
                isEndTimeValid: true,
                end_time_error_message: "",
                isStartTimeValid: true,
                start_time_error_message: ""
            });
        }
        if (new Date(end_time) - new Date(start_time) <= 0) {
            this.setState({
                end_time: new Date(end_time),
                isEndTimeValid: false,
                end_time_error_message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            })
        } else {
            this.setState({
                end_time: new Date(end_time),
                isEndTimeValid: true,
                end_time_error_message: "",
                isStartTimeValid: true,
                start_time_error_message: ""
            });
        }
    }

    // save fight
    saveFight = async () => {
        await Promise.all([
            this.validate(),
        ]).then(() => {
            const { isFightNameError, isFightDescError, isFightBackGroundImgError, isFightNumStdError, isEndTimeValid, isStartTimeValid, fight_minitask
            } = this.state;
            console.log(fight_minitask.length);
            if (isFightNameError || isFightDescError || isFightBackGroundImgError || isFightNumStdError || !isEndTimeValid || !isStartTimeValid || fight_minitask.length === 0) {
                this.setState({
                    isOpenError: true,
                    errorMessage: "Dữ liệu ko hợp lệ"
                });
            } else {
                // call api here
                const { end_time, start_time, fight_name, numbers_std, fight_desc, backgroud_img, fight_minitask } = this.state;
                console.log(start_time);
                axios.post(`http://localhost:8081/api/v1/curd/fights`, {
                    "_id": "",
                    "fight_name": fight_name,
                    "numbers_std": parseInt(numbers_std),
                    "fight_desc": fight_desc,
                    "backgroud_img": backgroud_img,
                    "time_start": start_time,
                    "time_end": end_time,
                    "user_created": "",
                    "del": false,
                    "fight_type": "private"
                }).then(res => {
                    for (var x = 0; x < fight_minitask.length; x++) {
                        axios.post(`http://localhost:8081/api/v1/curd/fightminitask`, {
                            "_id": "",
                            "fight_id": res.data.id,
                            "minitask_id": fight_minitask[x].id
                        }).then(res => {
                        });
                    }
                    this.props.enqueueSnackbar('Tạo cuộc thi thành công', {
                        variant: 'success',
                    });
                });
            }
        });
    }

    closeModalError = () => {
        this.setState({ isOpenError: false })
    }

    render() {
        const { start_time, end_time, isEndTimeValid, isStartTimeValid, end_time_error_message, start_time_error_message, isOpenError, errorMessage,
            // Fight name
            fight_name,
            isFightNameError,
            fight_name_error,
            // Fight Desc
            fight_desc,
            isFightDescError,
            fight_desc_error,
            // Fight backgournd Img
            backgroud_img,
            isFightBackGroundImgError,
            fight_backgroundImg_error,
            // Fight num std
            numbers_std,
            isFightNumStdError,
            fight_numStd_error,
        } = this.state;
        return (
            <React.Fragment>
                <SnackbarProvider maxSnack={1}>
                    <Modal visible={this.state.open} effect="fadeInDown" onClickAway={() => this.closeModal()}>
                        <Box p={2}>
                            <MDReactComponent text={this.state.minitaskDesc} />
                        </Box>
                    </Modal>
                    <Modal visible={isOpenError} effect="fadeInDown" onClickAway={() => this.closeModalError()}>
                        <Box p={2}>
                            <Box p={1}>
                                <Typography variant="h6">Lỗi</Typography>
                            </Box>
                            <Box p={1}>
                                <Typography variant="h2">{errorMessage}</Typography>
                            </Box>
                            {/* <MDReactComponent text={errorMessage} /> */}
                        </Box>
                    </Modal>
                    <Slide in={true} direction="up" {...(true ? { timeout: 1200 } : {})}>
                        <Grid>
                            <Typography style={{ fontWeight: 200, fontSize: 35 }}>Tạo cuộc thi</Typography>
                        </Grid>
                    </Slide>
                    <Slide in={true} direction="up" {...(true ? { timeout: 1200 } : {})}>
                        <Box my={2} style={{ backgroundColor: "white", borderRadius: "8px" }}>
                            <Box p={2}>
                                <Box my={4}>
                                    <Grid xs={12} container>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Tên cuộc thi</Typography>
                                        </Grid>
                                        <Grid xs={10} sm={10} md={10}>
                                            <TextField
                                                id="outlined-basic" label="Tên cuộc thi" variant="outlined" fullWidth
                                                value={fight_name}
                                                error={isFightNameError}
                                                helperText={fight_name_error}
                                                onChange={this.onChangeFightName}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={4}>
                                    <Grid xs={12} container>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Mô tả cuộc thi</Typography>
                                        </Grid>
                                        <Grid xs={10} sm={10} md={10}>
                                            <TextField id="outlined-basic" label="Mô tả cuộc thi" multiline
                                                rows={4} variant="outlined" fullWidth
                                                value={fight_desc}
                                                error={isFightDescError}
                                                helperText={fight_desc_error}
                                                onChange={this.onChangeFightDesc}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={4}>
                                    <Grid xs={12} container>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Ảnh</Typography>
                                        </Grid>
                                        <Grid xs={5} sm={5} md={5}>
                                            <TextField id="outlined-basic" label="Ảnh cuộc thi" variant="outlined" fullWidth
                                                value={backgroud_img}
                                                error={isFightBackGroundImgError}
                                                helperText={fight_backgroundImg_error}
                                                onChange={this.onChangeFightBackgroundImg}
                                            />
                                        </Grid>
                                        <Grid container item xs={5} sm={5} md={5} justify="center">
                                            <Box mx={2} border={2}>
                                                <CardMedia
                                                    component="img"
                                                    alt="Ảnh cuộc thi"
                                                    height="200"
                                                    image={backgroud_img===""?"https://icye.vn/Images/images/contest.jpg":backgroud_img}
                                                    title="Ảnh cuộc thi"
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={4}>
                                    <Grid xs={12} container>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Ngày bắt đầu</Typography>
                                        </Grid>
                                        <Grid xs={3} sm={3} md={3}>
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <DateTimePicker
                                                    label="Ngày bắt đầu"
                                                    helperText={start_time_error_message}
                                                    error={!isStartTimeValid}
                                                    ampm={false}
                                                    disablePast
                                                    inputVariant="outlined"
                                                    value={start_time}
                                                    onChange={this.handleStartTimeChange}
                                                    showTodayButton
                                                    format="DD/MM/YYYY hh:mm a"
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Số lượng người tham gia</Typography>
                                        </Grid>
                                        <Grid xs={5} sm={5} md={5}>
                                            <TextField style={{ minWidth: 200 }} id="outlined-basic" label="Số lượng người tham gia" type="number" min="1" variant="outlined"
                                                value={numbers_std}
                                                error={isFightNumStdError}
                                                helperText={fight_numStd_error}
                                                onChange={this.onChangeNumStd}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={4}>
                                    <Grid xs={12} container>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Ngày kết thúc</Typography>
                                        </Grid>
                                        <Grid xs={3} sm={3} md={3}>
                                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                                <DateTimePicker
                                                    disablePast
                                                    helperText={end_time_error_message}
                                                    error={!isEndTimeValid}
                                                    label="Ngày kết thúc"
                                                    inputVariant="outlined"
                                                    value={end_time}
                                                    onChange={this.handleEndTimeChange}
                                                    showTodayButton
                                                    format="DD/MM/YYYY hh:mm a"
                                                />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                        <Grid container item xs={2} sm={2} md={2} alignItems="flex-start">
                                            <Typography style={{ fontWeight: 500, fontSize: 17 }}>Loại cuộc thi</Typography>
                                        </Grid>
                                        <Grid xs={5} sm={5} md={5}>
                                            <FormControl variant="outlined" style={{ minWidth: 200 }}>
                                                <InputLabel id="demo-simple-select-outlined-label">Loại cuộc thi</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={2}
                                                    disabled
                                                    // onChange={handleChange}
                                                    label="Loại cuộc thi"
                                                >
                                                    {/* <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem> */}
                                                    {/* <MenuItem value={1}>Công khai</MenuItem> */}
                                                    <MenuItem value={2}>Riêng tư</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Box>
                    </Slide>
                    <Slide in={true} direction="up" {...(true ? { timeout: 1700 } : {})}>
                        <Grid>
                            <Typography style={{ fontWeight: 200, fontSize: 35 }}>Thêm thách thức</Typography>
                        </Grid>
                    </Slide>
                    <Slide in={true} direction="up" {...(true ? { timeout: 1700 } : {})}>
                        <Box my={2} style={{ backgroundColor: "white", borderRadius: "8px" }}>
                            <Grid xs={12} container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper >
                                        <Box height={449} bgcolor="#1F74BE" color="primary.contrastText" p={{ xs: 2, sm: 2, md: 2 }}>
                                            <Box display="flex">
                                                <Box p={1} flexGrow={1}>
                                                    <Typography variant="h5" gutterBottom>
                                                        Thách thức ({this.state.fight_minitask.length})
                                                </Typography>
                                                </Box>
                                                <Box>
                                                    {this.state.fight_minitask.length > 0 ?
                                                        <Button variant="contained" color="#b39ddb" onClick={this.saveMinitaskList}>Import</Button> :
                                                        ""
                                                    }
                                                </Box>
                                            </Box>
                                            {this.state.fight_minitask.length > 0 ?
                                                <div style={{ overflow: 'auto', minHeight: '350px', backgroundColor: "white" }}>
                                                    <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                                                        <TableHead>
                                                            <TableRow style={{
                                                                backgroundColor: "#ffred5f5",
                                                                height: "5px"
                                                            }}>
                                                                <TableCell>Tên thách thức</TableCell>
                                                                {/* <TableCell align="right">Minitask name</TableCell> */}
                                                                <TableCell align="right">Điểm</TableCell>
                                                                {/* <TableCell align="right">Minitask Desc</TableCell> */}
                                                                <TableCell align="right">Độ khó</TableCell>
                                                                <TableCell align="right"></TableCell>
                                                                <TableCell align="right"></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {this.state.fight_minitask.map(row => (
                                                                <Silde in={true} direction="left" {...(true ? { timeout: 100 } : {})}>
                                                                    <TableRow bgcolor={row.isNew ? "#bbdefb" : ""} key={row.task_name}>
                                                                        <TableCell component="th" scope="row">
                                                                            {row.mini_task_name}
                                                                        </TableCell>
                                                                        {/* <TableCell align="right">{row.mini_task_name}</TableCell> */}
                                                                        <TableCell align="right">{row.code_point}</TableCell>
                                                                        {/* <TableCell align="right">{row.mini_task_desc}</TableCell> */}
                                                                        <TableCell align="right">
                                                                            <Tooltip title="Độ khó" placement="top">
                                                                                <div style={{ marginLeft: 10 }}>
                                                                                    {this.renderLevelMinitaskChip(row.level)}
                                                                                </div>
                                                                            </Tooltip>
                                                                        </TableCell>
                                                                        <TableCell align="right" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">Mô tả</Button></TableCell>
                                                                        <TableCell align="right">
                                                                            <Button onClick={() => { this.removeMinitask(row) }} startIcon={<DeleteForeverIcon />} size="large" color="secondary"> Xóa</Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </Silde>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                :
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Chưa có thách thức nào.
                                            </Typography>}
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box p={2} boxShadow={2}>
                                        <Box p={1}>
                                            <Grid xs={12} container justify="center" spacing={2}>
                                                <Grid xs={5} item>
                                                    <Paper component="form">
                                                        <IconButton aria-label="search">
                                                            <SearchIcon />
                                                        </IconButton>
                                                        <InputBase
                                                            placeholder="Search"
                                                            inputProps={{ 'aria-label': 'search google maps' }}
                                                            onChange={this.onChangeSearch}
                                                        />
                                                        <Divider orientation="vertical" />
                                                    </Paper>
                                                </Grid>
                                                <Grid xs={3} bgcolor="white" item>
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel id="demo-simple-select-label">Level</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={this.state.sortByLevel}
                                                            onChange={this.onChangeSort}
                                                        >
                                                            <MenuItem value={10}>Easy</MenuItem>
                                                            <MenuItem value={20}>Medium</MenuItem>
                                                            <MenuItem value={30}>Hard</MenuItem>
                                                            <MenuItem value={40}>All</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid xs={4} bgcolor="white" item>
                                                    <Typography id="range-slider" gutterBottom>
                                                        Code point
                                            </Typography>
                                                    <Slider
                                                        value={this.state.sliderValue}
                                                        onChange={this.onChangeSlider}
                                                        valueLabelDisplay="auto"
                                                        aria-labelledby="range-slider"
                                                        min={0}
                                                        max={200}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <div style={{ overflow: 'auto', height: '340px' }}>
                                            <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                                                <TableHead style={{ backgroundColor: "#F1F1F1", minHeight: "50px" }}>
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        <TableCell>Tên thách thức</TableCell>
                                                        <TableCell align="right">Điểm</TableCell>
                                                        <TableCell align="right">Độ khó</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.tempMinitaskList.map(row => (
                                                        <TableRow key={row.task_name}>
                                                            <TableCell align="center">
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    startIcon={<ArrowBackIcon />}
                                                                    aria-label="move selected right"
                                                                    onClick={() => this.getMinitaskFromBank(row)}
                                                                >
                                                                    {/* &lt; */}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Typography style={{ fontWeight: 700, fontSize: 14 }}>
                                                                    {row.mini_task_name}
                                                                </Typography>
                                                            </TableCell>
                                                            {/* <TableCell align="right">{row.mini_task_name}</TableCell> */}
                                                            <TableCell align="right">{row.code_point}</TableCell>
                                                            {/* <TableCell align="right">{row.mini_task_desc}</TableCell> */}
                                                            <TableCell align="right">
                                                                <Tooltip title="Độ khó" placement="top">
                                                                    <div style={{ marginLeft: 10 }}>
                                                                        {/* {row.level} */}
                                                                        {this.renderLevelMinitaskChip(row.level)}
                                                                    </div>
                                                                </Tooltip>
                                                            </TableCell>
                                                            <TableCell align="center" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">Mô tả</Button></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box p={2}>
                                <Button variant="contained" onClick={this.saveFight} style={{ backgroundColor: "#7BC043", color: "white" }}>
                                    Lưu
                            </Button>
                            </Box>
                        </Box>
                    </Slide>
                </SnackbarProvider>
            </React.Fragment>
        );
    }
}

export default withSnackbar(CreateRoomPage);