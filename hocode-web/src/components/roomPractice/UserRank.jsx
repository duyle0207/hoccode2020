import React, { Component } from 'react';
import {
    Grid,
    Typography,
} from '@material-ui/core';

class UserRank extends Component {
    render() {
        return (
            <Grid container xs={12} wrap="nowrap" spacing={2}>
                <Grid item xs={1} md={1} sm={1}>
                    <Typography style={{fontWeight:350, fontSize:16}}>1</Typography>
                </Grid>
                <Grid item xs={5} md={5} sm={5} wrap="nowrap">
                    <Typography style={{fontWeight:350, fontSize:16}} noWrap>vanduyit027@</Typography>
                </Grid>
                <Grid item xs={3} md={3} sm={3}>
                    <Typography style={{fontWeight:350, fontSize:16}}>500</Typography>
                </Grid>
                <Grid item xs={3} md={3} sm={3}>
                    <Typography style={{fontWeight:350, fontSize:16}}>00:01:10</Typography>
                </Grid>
            </Grid>
        );
    }
}

export default UserRank;