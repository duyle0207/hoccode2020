import React, { Component } from 'react';
import {
    Grid,
    Typography,
} from '@material-ui/core';

class UserRank extends Component {
    componentDidMount(){
        console.log(this.props.user);
    }
    render() {
        const { user, rank, isCurrentUser } = this.props;
        return (
            <Grid container xs={12} wrap="nowrap" spacing={2} style={{backgroundColor: isCurrentUser?"#F1F1F1":""}}>
                <Grid item xs={1} md={1} sm={1}>
                    <Typography style={{fontWeight:350, fontSize:16}}>{rank+1}</Typography>
                </Grid>
                <Grid item xs={5} md={5} sm={5} wrap="nowrap">
                    <Typography style={{fontWeight:350, fontSize:16}} noWrap>{user.email}</Typography>
                </Grid>
                <Grid item xs={3} md={3} sm={3}>
                    <Typography style={{fontWeight:350, fontSize:16}}>{user.point}</Typography>
                </Grid>
                <Grid item xs={3} md={3} sm={3}>
                    <Typography style={{fontWeight:350, fontSize:16}}>{user.finished_time}</Typography>
                </Grid>
            </Grid>
        );
    }
}

export default UserRank;