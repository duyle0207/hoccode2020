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
                <Grid item xs={7} md={7} sm={7} wrap="nowrap">
                    <Typography style={{fontWeight:350, fontSize:16}} noWrap>{user.email}</Typography>
                </Grid>
                <Grid item container justify="center"  xs={4} md={4} sm={4}>
                    <Typography style={{fontWeight:350, fontSize:16}}>{user.point}</Typography>
                </Grid>
                {/* <Grid item container xs={4} md={4} sm={4}>
                    <Typography noWrap style={{fontWeight:350, fontSize:16}}>{new Date(user.finished_time).toLocaleTimeString() === "06:42:04"}</Typography>
                </Grid> */}
            </Grid>
        );
    }
}

export default UserRank;