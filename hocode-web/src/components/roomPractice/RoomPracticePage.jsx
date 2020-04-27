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
                    <Grid xs={12} sm={3} md={3}>
                        <Box p={2} display="flex" justifyContent="center">
                            <img src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                // width="100%"
                                height="150px" alt="banner" />
                        </Box>
                    </Grid>
                </Grid>
                <Box my={2} display="flex" justifyContent="center">
                    <Box flexGrow={1}>
                        <Typography style={{ fontSize: 28, fontWeight: 460 }}>Chiến trường</Typography>
                    </Box>
                    <Box>
                        <Button variant="contained" component={ Link } to={`/profile/create-contest`} startIcon={<AddBoxIcon />}>Tạo cuộc chiến</Button>
                    </Box>
                </Box>
                {/* <Grid container xs={12}> */}
                <AppBar position="static">
                    <Tabs value={tab} onChange={this.handleChangeTab} aria-label="simple tabs example">
                        <Tab label="Công khai" />
                        <Tab label="Riêng tư" />
                    </Tabs>
                </AppBar>
                <TabPanel value={tab} index={0}>
                    {[1, 2, 3, 4].map((room, index) => {
                        return <Room index={index} />
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