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
    Slide
} from "@material-ui/core";

import { Link } from "react-router-dom";

import {
    Pagination
} from '@material-ui/lab';

import Room from './Room';
import AddBoxIcon from '@material-ui/icons/AddBox';

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
        });
    }

    componentDidMount() {

    }

    handleChangeTab = (event, newValue) => {
        this.setState({ tab: newValue });
    }

    render() {
        const { tab } = this.state;

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
                            <Typography style={{fontSize: 30, fontWeight: 200, color: "#b3b3b3"}}>
                                <span style={{fontSize: 30, fontWeight: 200, color: "#FFFFFF"}}>Chiến trường</span> Hocode
                            </Typography>
                        </Box>
                        <Box mb={4} display="flex" justifyContent="center">
                            <Typography style={{fontSize: 18, fontWeight: 200, color: "#b3b3b3"}}>
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
                        <Button variant="contained" style={{backgroundColor: "#E24CE1"}} component={ Link } to={`/profile/create-contest`} startIcon={<AddBoxIcon style={{color:"white"}} />}>
                            <Typography variant="button" style={{ color: "white" }}>Tạo cuộc chiến</Typography>
                        </Button>
                    </Box>
                </Box>
                {/* <Grid container xs={12}> */}
                <AppBar position="static" style={{backgroundColor:"white", color:"black"}}>
                    <Tabs value={tab} onChange={this.handleChangeTab} aria-label="simple tabs example">
                        <Tab label="Công khai" />
                        <Tab label="Riêng tư" />
                    </Tabs>
                </AppBar>
                <TabPanel value={tab} index={0}>
                    {[1, 2, 3, 4].map((room, index) => {
                        return <Slide in={true} direction="right" {...(true ? { timeout: 2000 } : {})}><Room index={index} /></Slide>
                    })}
                    <Box p={2} display="flex" justifyContent="center">
                        <Box>
                            <Pagination count={3} page={1} />
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    Item Two
                    </TabPanel>
                {/* </Grid> */}
            </React.Fragment>
        );
    }
}

export default RoomPracticePage;