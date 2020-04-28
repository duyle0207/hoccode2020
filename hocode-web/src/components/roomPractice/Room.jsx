import React, { Component } from 'react';
import './room.css';
import {
    Box,
    Grid,
    Typography,
    Button,
} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';

class Room extends Component {
    render() {
        const { index } = this.props;

        return (
            <Box my={1} boxShadow={2} style={{backgroundColor:index%2===0 ? "white" : "#F5F5F5"}}>
                <Grid container xs={12}>
                    <Grid item xs={12} sm={2} md={2}>
                        <Box p={2} display="flex" justifyContent="center">
                            <img src="https://assets.leetcode.com/static_assets/public/images/LeetCode_Cup.png"
                                width="100px"
                                height="100px" alt="banner" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Box mt={2}>
                            <Typography style={{ fontSize: 30, fontWeight: 500 }}>Sasuke</Typography>
                        </Box>
                        <Box>
                            <Typography noWrap style={{ fontSize: 15, fontWeight: 200 }}>Sasukssssssssssss
                            ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
                            ssssssssssssssssssssssssssssssssssssssssssssssssse
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} sm={2} md={2} justify="center" alignItems="center">
                        <Box mx={1} display="flex" justifyContent="center" alignItems="center">
                            <PersonIcon fontSize="large"/>
                        </Box>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Typography style={{ fontSize: 15, fontWeight: 450 }}>120 thí sinh</Typography>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} sm={2} md={2} justify="center" alignItems="center">
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button variant="contained" color="primary">
                                Tham gia
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default Room;