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
  DateField,
  //  BooleanField,
  EditButton,
  DeleteButton,
  DateTimeInput,
  NumberInput,
  ImageField,
  SelectInput
} from "react-admin";
import Skeleton from "@material-ui/lab/Skeleton";

import Slide from '@material-ui/core/Slide';

import axios from "axios";
//import { permitted } from '../utils';
import ModelFightEditToolbar from "../customActions/ModelFightEditToolbar";

import ModelFightFilter from "../filters/ModelFightFilter";
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

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';

export const ModelFightList = props => (
    <List
        {...props}
        title="Danh sách các cuộc thi"
        filters={<ModelFightFilter/>}
        bulkActionButtons={false}
    >
        <Datagrid>
        {/* <TextField                source="id"                sortable={false}            /> */}
        <TextField source="fight_name" sortable={false} />
        <ImageField
            className="thumbNailView"
            source="backgroud_img"
            sortable={false}
        />
        <DateField source="time_start" />
        <DateField source="time_end" />
        <EditButton />
        <DeleteButton />
        </Datagrid>
    </List>
);

const validateFightCreate = (values) => {
    const errors = {};
    if (!values.fight_name) {
      errors.fight_name = ['The fight name is required'];
    }
    if (!values.backgroud_img) {
      errors.backgroud_img = ['The background image is required'];
    }
    if (!values.time_start) {
      errors.time_start = ['The start time is required'];
    }
    if (!values.time_end) {
      errors.end_time = ['The end time is required'];
    }
    if (!values.numbers_std) {
        errors.numbers_std = ['The numbers student is required'];
      }
    if (values.time_end - values.time_start <= 0) {
      errors.end_time = ['The end time must be longer than start time']
    }
    return errors
  };
class ModelFightCreate extends Component {
    constructor(props) {
      super(props);
      this.state = ({
      })
    }
  
    componentDidMount() {
     
    }
    render() {
      return (
        <Create {...this.props} title="Tạo Cuộc Thi">
          <SimpleForm redirect="show" validate={validateFightCreate} >
            <TextInput resettable source="fight_name" />
            <TextInput resettable source="backgroud_img" />
            <TextInput resettable multiline source="fight_desc" />
            <NumberInput label="Số lượng thí sinh" source="numbers_std"/>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DateTimeInput
                source="time_start"
                label="Start time"
                options={{ format: 'MM/DD/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
                required
              />
              <DateTimeInput
                source="time_end"
                label="End time"
                options={{ format: 'MM/DD/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
              />
            </MuiPickersUtilsProvider>
          </SimpleForm>
        </Create>
      )
    }
}

class ModelFightEdit extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      minitask : [],
      isLoading: true,
      tempMinitaskList: [],
      open: false,
      fight: {},
      minitaskDesc: "",
      errorMessage: "",
      openErr: false, 
      MinitaskListID : []
    })
  }

  componentDidMount() {
    axios.get("http://localhost:8081/api/v1/curd/minitasks").then(res => {
      this.setState({ tempMinitaskList: res.data, isLoading: false });
      console.log(res.data);
    });

    axios 
    .get(`http://localhost:8081/api/v1/curd/listminitaskfight/${this.props.id}`)
    .then(res => {
      console.log(res.data);
      this.setState({minitask: res.data});
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
    for (var i = 0; i < this.state.minitask.length; i++) {
      if (this.state.minitask[i].id === id) {
        return false;
      }
    }
    return true;
  }
  getMinitaskFromBank(task) {
    if (this.isDuplicateMinitask(task.id)) {
      const temp_task_minitask = this.state.minitask;
      var data = {
        fight_id: this.props.id,
        minitask_id: task.id
      }
      axios.post(`http://localhost:8081/api/v1/curd/fightminitask`, data)
            .then(res => {
              axios.get(`http://localhost:8081/api/v1/curd/listminitaskfight/${this.props.id}`)
                    .then(res => {
                      this.setState({
                        minitask: res.data,
                        openErr: true,
                        errorMessage: "Added a minitask"
                      })
                    });
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
    const temp_task_minitask = this.state.minitask;
    axios.delete(`http://localhost:8081/api/v1/curd/delminitask/${this.props.id}/${id}`)
         .then(res => {
           axios.get(`http://localhost:8081/api/v1/curd/listminitaskfight/${this.props.id}`)
                .then( res => {
                  this.setState({
                    minitask: res.data,
                    openErr: true,
                    errorMessage: " Deleted Successfully"
                  })
                });
         });
    // temp_task_minitask.splice(id, 1); 
    // console.log(temp_task_minitask);
    
    console.log(this.state.minitask);
  }

  onChangeSearch = (event) => {
    const keyword = event.target.value;
    if (keyword === "") {
      axios.get(`http://localhost:8081/api/v1/curd/minitasks`).then(res => {
        console.log(res.data);
        this.setState({  isLoading: false, tempMinitaskList: res.data });
      });
    }
    else {
      axios.get(`http://localhost:8081/api/v1/curd/searchMinitasks/${keyword}`).then(res => {
        console.log(res.data);
        this.setState({ isLoading: false, tempMinitaskList: res.data })
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>

            <Grid xs={4} item>
              <Edit {...this.props} title="Sửa Cuộc Thi">
                <SimpleForm toolbar={<ModelFightEditToolbar />}>
                  <TextInput resettable source="fight_name" />
                  <TextInput resettable source="backgroud_img" />
                  <TextInput resettable multiline source="fight_desc" />
                  <NumberInput label="Số lượng thí sinh" source="numbers_std"/>
                </SimpleForm>
              </Edit>
            </Grid>

            <Grid item xs={8}>
              <Paper >
                <Box height={375} bgcolor="#1F74BE" color="primary.contrastText" p={{ xs: 2, sm: 2, md: 2 }}>
                  <Box display="flex">
                        <Box p={1} flexGrow={1}>
                          <Typography variant="h5" gutterBottom>
                            Task's Minitask ({this.state.minitask.length})
                        </Typography>
                        </Box>                       
                      </Box>
                      {this.state.minitask.length > 0 ?
                  <Card>
                    <div style={{ overflow: 'auto', height: '300px' }}>
                      <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow style={{
                              backgroundColor: "#ffred5f5",
                              height: "5px"
                            }}>
                              <TableCell>Minitask name</TableCell>                             
                              <TableCell align="right">Code point</TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right"></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.state.minitask.map(row => (
                              <TableRow bgcolor={row.isNew ? "#bbdefb" : ""} key={row.task_name}>
                                <TableCell component="th" scope="row">
                                  {row.mini_task_name}
                                </TableCell>
                                {/* <TableCell align="right">{row.mini_task_name}</TableCell> */}
                                <TableCell align="right">{row.code_point}</TableCell>
                                {/* <TableCell align="right">{row.mini_task_desc}</TableCell> */}                              
                                <TableCell align="right" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">View Desc</Button></TableCell>
                                <TableCell align="right">
                                  <Button onClick={() => this.removeMinitask(row.id)} startIcon={<DeleteForeverIcon />} size="large" color="secondary"> Remove</Button>
                                </TableCell>
                              </TableRow>
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
                              <Grid xs={6} item>
                                <Paper component="form">
                                  <IconButton aria-label="search">
                                    <SearchIcon />
                                  </IconButton>
                                  <InputBase
                                    placeholder="Search minitask..."
                                    inputProps={{ 'aria-label': 'search google maps' }}
                                    onChange={this.onChangeSearch}
                                  />
                                  <Divider orientation="vertical" />
                                </Paper>
                              </Grid>
                              {/* <Grid xs={1} bgcolor="white" item>
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
                              </Grid> */}
                              {/* <Grid xs={2} bgcolor="white" item>
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
                              </Grid> */}
                              <Grid xs={6} bgcolor="white" item></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                      <Card>
                        <div style={{ overflow: 'auto', height: '340px' }}>
                          <Table style={{ tableLayout: 'fixed' }} size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{fontSize:16, color: "red", fontWeight:700}}>Minitask name</TableCell>
                                <TableCell style={{fontSize:16, color: "red", fontWeight:700}} align="right">Code point</TableCell>                              
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
                                      startIcon={<KeyboardBackspaceIcon />}
                                      aria-label="move selected right"
                                      onClick={() => this.getMinitaskFromBank(row)}
                                    >
                                      {/* &lt; */}
                                    </Button>
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {row.mini_task_name}
                                  </TableCell>
                                  {/* <TableCell align="right">{row.mini_task_name}</TableCell> */}
                                  <TableCell align="right">{row.code_point}</TableCell>
                                  {/* <TableCell align="right">{row.mini_task_desc}</TableCell> */}
                                  <TableCell align="center" onClick={() => this.getMinitaskDesc(row.id)}><Button color="primary">View Desc</Button></TableCell>
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
    );
  }

}
export {  ModelFightCreate, ModelFightEdit };