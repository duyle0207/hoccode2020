/**
 * Generated ModelTask.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React, { Component } from "react";
import {
  Create,
  Datagrid,
  TextField,
  //   BooleanInput,
  SimpleForm,
  List,
  TextInput,
  Edit,
  //  BooleanField,
  EditButton,
  DeleteButton,
  ImageField,
  SelectInput
} from "react-admin";
import Skeleton from "@material-ui/lab/Skeleton";

import Slide from '@material-ui/core/Slide';

import axios from "axios";
//import { permitted } from '../utils';

import ModelTaskEditToolbar from "../customActions/ModelTaskEditToolbar";

import ModelTaskFilter from "../filters/ModelTaskFilter";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";

import Card from '@material-ui/core/Card';

import Button from '@material-ui/core/Button';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Modal from 'react-awesome-modal';

import MDReactComponent from 'markdown-react-js';

import Typography from '@material-ui/core/Typography';

import Paper from '@material-ui/core/Paper';

import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import Silde from '@material-ui/core/Slide';

export const ModelTaskList = props => (
  <List
    {...props}
    title="Danh sách Chủ đề con"
    filters={<ModelTaskFilter />}
    bulkActionButtons={false}
  >
    <Datagrid>
      {/* <TextField                source="id"                sortable={false}            /> */}
      <TextField source="task_name" sortable={false} />
      <ImageField
        className="thumbNailView"
        source="background_image"
        sortable={false}
      />
      {/* <TextField                source="course_id"                sortable={false}            /> */}
      {/* <BooleanField                source="del"                sortable={false}            /> */}
      {/* <                source="minitasks"                sortable={false}            /> */}
      {/* <TextField                source="timestamp"                sortable={false}            /> */}
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

class ModelTaskCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8081/api/v1/courses").then(res => {
      console.log(res.data);
      this.setState({ course: res.data, isLoading: false });
    });
  }

  render() {
    var choicesCourse = this.state.course.map(val => {
      var rObj = {};
      rObj["id"] = val.id;
      rObj["name"] = val.course_name;
      return rObj;
    });

    return (
      <Create {...this.props} title="Tạo Chủ đề con">
        <SimpleForm redirect="show">
          <TextInput source="task_name" />
          <TextInput source="background_image" />
          {this.state.isLoading ? (
            <Skeleton />
          ) : (
              <SelectInput source="course_id" choices={choicesCourse} />
            )}
          {/* <BooleanInput                source="del"            /> */}
          {/* <TextInput                source="id"            /> */}
          {/* <TextInput                source="minitasks"            /> */}
          {/* <TextInput                source="timestamp"            /> */}
        </SimpleForm>
      </Create>
    );
  }
}

class ModelTaskEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: [],
      isLoading: true,
      minitaskBank: [],
      open: false,
      minitaskDesc: "",
      fontSize: "",
      minitaskListFromBank: [],
      errorMessage: "",
      openErr: false,
      task_minitask: [],
      temp_task_minitask: [],
      sortByLevel: 40,
      tempMinitaskList: [],
      sliderValue: [0, 200],
      isOpenMessage: false,
      importedMinitask: [],
      task: {},
      tasks: [],
      isLoadingImportTask: false,
    };

    this.getMinitaskFromBank = this.getMinitaskFromBank.bind(this);
    this.removeMinitask = this.removeMinitask.bind(this);
    this.isDuplicateMinitask = this.isDuplicateMinitask.bind(this);
  }

  async componentDidMount() {
    await axios.get(`http://localhost:8081/api/v1/auth/tasks/${this.props.id}`).then(res => {
      console.log(res.data);
      this.setState({ task: res.data })
    });
    axios.get("http://localhost:8081/api/v1/courses").then(res => {
      this.setState({ course: res.data, isLoading: false });
    });
    axios.get("http://localhost:8081/api/v1/curd/minitasks").then(res => {
      this.setState({ minitaskBank: res.data, tempMinitaskList: res.data, isLoading: false });
    });
    axios.get(`http://localhost:8081/api/v1/getMinitasksByTaskID/${this.props.id}`).then(res => {
      this.setState({ task_minitask: res.data, temp_task_minitask: res.data });
    });
    axios
      .get(
        `http://localhost:8081/api/v1/auth/courses/${this.state.task.course_id}/tasks`
      )
      .then(res => {
        const tasks = res.data;
        let tasks_reverse = tasks.reverse();
        this.setState({ tasks: tasks_reverse });
      });
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

  closeModalError() {
    this.setState({
      openErr: false
    });
  }

  isDuplicateMinitask(id) {
    for (var i = 0; i < this.state.temp_task_minitask.length; i++) {
      if (this.state.temp_task_minitask[i].id === id) {
        return false;
      }
    }
    return true;
  }

  checkDuplicateMinitask = (minitask_id) => {
    const task_list = this.state.tasks;
    for (var i = 0; i < task_list.length; i++) {
      for (var j = 0; j < task_list[i].minitasks.length; j++) {
        if (task_list[i].minitasks[j].id === minitask_id) {
          return false;
        }
      }
    }
    return true;
  }

  getMinitaskFromBank(minitask) {
    if (this.isDuplicateMinitask(minitask.id) &&
      this.checkDuplicateMinitask(minitask.id)) {
      const temp_task_minitask = this.state.temp_task_minitask;
      minitask["isNew"] = true;
      temp_task_minitask.push(minitask);
      this.setState({
        temp_task_minitask
      });
    }
    else {
      this.setState({
        errorMessage: "This minitask already exists",
        openErr: true
      });
    }
  }

  removeMinitask(id) {
    const temp_task_minitask = this.state.temp_task_minitask;
    var i = -1;

    console.log(id);

    temp_task_minitask.forEach((minitask, index) => {
      console.log(minitask);
      if (id.isNew === true) {
        if (minitask.id === id.id) {
          console.log(minitask.id);
          i = index;
        }
      }
      else if (id.isNew === undefined && id.id === minitask.id) {
        this.setState({ isLoadingImportTask: true });
        axios.delete(`http://localhost:8081/api/v1/curd/task_minitask/${this.props.id}/${id.id}/${this.state.task.course_id}`).then(res => {
          axios.get(`http://localhost:8081/api/v1/getMinitasksByTaskID/${this.props.id}`).then(res => {
            this.setState({ isLoadingImportTask: false });
            axios
              .get(
                `http://localhost:8081/api/v1/auth/courses/${this.state.task.course_id}/tasks`
              )
              .then(res => {
                const tasks = res.data;
                let tasks_reverse = tasks.reverse();
                this.setState({ tasks: tasks_reverse });
              });
            this.setState({
              task_minitask: res.data,
              temp_task_minitask: res.data,
              errorMessage: "Delete Successfully",
              openErr: true,
            });
          });
        }).catch(err => {
          console.log(err);
          // axios.get(`http://localhost:8081/api/v1/getMinitasksByTaskID/${this.props.id}`).then(res => {
          //   console.log(res.data);
          //   this.setState({
          //     task_minitask: res.data,
          //     temp_task_minitask: res.data,
          //     errorMessage: "Delete Successfully",
          //     openErr: true
          //   });
          // });
        });
      }
    });
    console.log(i);
    if (i !== -1) {
      temp_task_minitask.splice(i, 1);
      this.setState({ temp_task_minitask });
    }
  }

  renderLevelMinitaskChip(minitask) {
    // alert(minitask);
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
    if (keyword === "") {
      axios.get("http://localhost:8081/api/v1/curd/minitasks").then(res => {
        console.log(res.data);
        this.setState({ minitaskBank: res.data, isLoading: false, tempMinitaskList: res.data });
      });
    }
    else {
      axios.get(`http://localhost:8081/api/v1/curd/searchMinitasks/${keyword}`).then(res => {
        console.log(res.data);
        this.setState({ minitaskBank: res.data, isLoading: false, tempMinitaskList: res.data })
      });
    }
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

  saveMinitaskList = () => {
    const minitaskList = this.state.task_minitask;
    minitaskList.forEach(e => {
      if (e.isNew) {
        var obj = {};
        obj["task_id"] = this.props.id;
        obj["mini_task_id"] = e.id
        axios.post("http://localhost:8081/createTaskMinTask", obj).then(res => {
          this.setState({ isLoadingImportTask: true });
          axios.get(`http://localhost:8081/api/v1/getMinitasksByTaskID/${this.props.id}`).then(res => {
            this.setState({
              task_minitask: res.data,
              temp_task_minitask: res.data,
              errorMessage: "Import Successfully",
              openErr: true,
              isLoadingImportTask: false,
            });
          });
        });
      }
    });
  }

  render() {
    var choicesCourse = this.state.course.map(val => {
      var rObj = {};
      rObj["id"] = val.id;
      rObj["name"] = val.course_name;
      return rObj;
    });

    return (
      <React.Fragment>
        <React.Fragment>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              <Grid xs={4} item>
                <Edit {...this.props} title="Sửa Chủ đề con">
                  <SimpleForm toolbar={<ModelTaskEditToolbar />}>
                    <TextInput resettable source="id" disabled />
                    <TextInput source="task_name" />
                    <TextInput source="background_image" />
                    {this.state.isLoading ? (
                      <Skeleton />
                    ) : (
                        <SelectInput source="course_id" choices={choicesCourse} />
                      )}
                  </SimpleForm>
                </Edit>
              </Grid>
              <Grid xs={8} item>
                <Paper >
                  <Box height={375} bgcolor="#1F74BE" color="primary.contrastText" p={{ xs: 2, sm: 2, md: 2 }}>
                    <Box display="flex">
                      <Box p={1} flexGrow={1}>
                        <Typography variant="h5" gutterBottom>
                          Task's Minitask ({this.state.task_minitask.length})
                      </Typography>
                      </Box>
                      <Box>
                        {this.state.temp_task_minitask.length > 0 ?
                          <Button variant="contained" color="#b39ddb" onClick={this.saveMinitaskList}>Import</Button> :
                          ""
                        }
                      </Box>
                    </Box>
                    {this.state.temp_task_minitask.length > 0 ?
                      <Card>
                        <div style={{ overflow: 'auto', height: '300px' }}>
                          <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow style={{
                                backgroundColor: "#ffred5f5",
                                height: "5px"
                              }}>
                                <TableCell>Minitask name</TableCell>
                                {/* <TableCell align="right">Minitask name</TableCell> */}
                                <TableCell align="right">Code point</TableCell>
                                {/* <TableCell align="right">Minitask Desc</TableCell> */}
                                <TableCell align="right">Level</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.temp_task_minitask.map(row => (
                                <Silde in={true} direction="up">
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
                                    <TableCell align="right" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">View Desc</Button></TableCell>
                                    <TableCell align="right">
                                      <Button onClick={() => { this.removeMinitask(row) }} startIcon={<DeleteForeverIcon />} size="large" color="secondary"> Remove</Button>
                                    </TableCell>
                                  </TableRow>
                                </Silde>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                      :
                      <Typography variant="subtitle1" gutterBottom>
                        There are no minitask.
                    </Typography>}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Grid item xs={12}>
              <Grid container justify="center" spacing={2}>
                <Grid xs={12} item>
                  <Paper >
                    <Box height={470} bgcolor="#ede7f6" color="black" p={{ xs: 2, sm: 2, md: 2 }}>
                      <Typography variant="h5" color="black" gutterBottom>
                        Minitask bank ({this.state.tempMinitaskList.length})
                      </Typography>
                      <Box my={1}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Grid container justify="center" spacing={2}>
                              <Grid xs={2} item>
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
                              <Grid xs={1} bgcolor="white" item>
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
                              <Grid xs={2} bgcolor="white" item>
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
                              <Grid xs={7} bgcolor="white" item></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                      <Card>
                        <div style={{ overflow: 'auto', height: '340px' }}>
                          <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Minitask name</TableCell>
                                <TableCell align="right">Code point</TableCell>
                                <TableCell align="right">Level</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.tempMinitaskList.map(row => (
                                <TableRow key={row.task_name}>
                                  <TableCell component="th" scope="row">
                                    {row.mini_task_name}
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
                                  <TableCell align="center" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">View Desc</Button></TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<ArrowUpwardIcon />}
                                      aria-label="move selected right"
                                      onClick={() => this.getMinitaskFromBank(row)}
                                    >
                                      {/* &lt; */}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Modal visible={this.state.open} effect="fadeInDown" onClickAway={() => this.closeModal()}>
            <Box p={2}>
              <MDReactComponent text={this.state.minitaskDesc} />
            </Box>
          </Modal>
          <Slide in={this.state.openErr} direction="up">
            <Modal visible={this.state.openErr} effect="fadeInDown" onClickAway={() => this.closeModalError()}>
              <Box p={2}>
                <Typography variant="h5" color="error" gutterBottom>
                  Thông báo
                </Typography>
                <Box my={3}>
                  <Typography variant="h4" gutterBottom>
                    {this.state.errorMessage}
                  </Typography>
                </Box>
              </Box>
            </Modal>
          </Slide>
        </React.Fragment>
      </React.Fragment >
    );
  }
}

export { ModelTaskCreate, ModelTaskEdit };

/** End of Generated Code **/
