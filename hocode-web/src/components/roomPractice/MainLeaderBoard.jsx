import React, { Component } from 'react';
import {
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow, TableCell, TableBody, Typography
} from "@material-ui/core";
import MinitaskBoard from "./MinitaskBoard";
import MinitaskBoardInfo from "./MinitaskBoardInfo";

class MainLeaderBoard extends Component {
    render() {
        return (
            <Grid>
                <TableContainer >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography style={{ fontSize: 25, fontWeight: 400 }}>
                                        HẠNG
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography style={{ fontSize: 25, fontWeight: 400 }}>
                                        TÊN ĐĂNG NHẬP
                                    </Typography>
                                </TableCell>
                                <MinitaskBoard/>
                                <MinitaskBoard/>
                                <TableCell>
                                    <Typography style={{ fontSize: 25, fontWeight: 400 }}>
                                        TỔNG ĐIỂM
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell>
                                    1
                                </TableCell>
                                <TableCell>vanduyit027@gmail.com</TableCell>
                                <MinitaskBoardInfo/>
                                <MinitaskBoardInfo/>
                                <TableCell>Yo</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }
}

export default MainLeaderBoard;