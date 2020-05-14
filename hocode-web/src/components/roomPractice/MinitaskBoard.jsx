import React, { Component } from 'react';
import {
    TableCell, Typography
} from "@material-ui/core";

class MinitaskBoard extends Component {
    render() {
        return (
            <TableCell>
                <Typography style={{ fontSize: 25, fontWeight: 400 }}>
                    BÀI 1
                </Typography>
            </TableCell>
        );
    }
}

export default MinitaskBoard;