import React, { Component } from 'react';
import {
    TableCell, Grid, Typography
} from "@material-ui/core";

import DoneIcon from '@material-ui/icons/Done';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

class MinitaskBoardInfo extends Component {
    render() {

        const { status, tried, point } = this.props;

        return (
            <TableCell align="center">
                <Grid container justify="center">
                    {
                        status==="tried" ? <ErrorOutlineIcon color="primary" fontSize="medium" /> : <DoneIcon style={{ color: "#4FB834" }} fontSize="medium" />
                    }
                </Grid>
                <Grid container justify="center">
                    <Typography style={{ fontSize: 18, fontWeight: 500 }}>
                        {
                            status === "tried" ? "-" : point
                        }
                    </Typography>
                </Grid>
                <Grid container justify="center" xs={12}>
                    <Typography style={{ fontSize: 12, fontWeight: 400, color: "#70757A" }}>
                        {tried} lần thử
                    </Typography>
                </Grid>
            </TableCell>
        );
    }
}

export default MinitaskBoardInfo;