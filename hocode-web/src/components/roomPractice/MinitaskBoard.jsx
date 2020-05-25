import React, { Component } from 'react';
import {
    TableCell, Typography, Grid
} from "@material-ui/core";

class MinitaskBoard extends Component {
    render() {

        const { minitask, index } = this.props;

        return (
            <TableCell align="center">
                <Grid container>
                    <Grid container justify="center">
                        <Typography noWrap style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
                            BÀI {index + 1}
                        </Typography>
                    </Grid>
                    <Grid container justify="center">
                        <Typography noWrap style={{ fontSize: 15, fontWeight: 600, color: "white" }}>
                            {minitask.mini_task_name}
                        </Typography>
                    </Grid>
                </Grid>
            </TableCell>
        );
    }
}

export default MinitaskBoard;