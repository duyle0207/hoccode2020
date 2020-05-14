import React, { Component } from 'react';
import {
    Grid,
    Paper,
    CardMedia,
    Typography,
    Box,
    Button
} from '@material-ui/core'

import { Link } from "react-router-dom";

class Fight extends Component {
    render() {
        const { fight } = this.props;
        return (
            <Grid item container xs={6} md={6} sm={6}>
                <Paper style={{ width: '100%' }}>
                    <Grid container xs={12}>
                        <Box>
                            <CardMedia
                                component="img"
                                alt="Fight img"
                                height="200"
                                src={fight.backgroud_img}
                                title="Fight img"
                            />
                        </Box>
                    </Grid>
                    <Box mx={2} mb={1}>
                        <Grid container xs={12}>
                            <Grid xs={12} container>
                                <Box my={2}>
                                    <Typography style={{ fontSize: 32, fontWeight: 400 }}>
                                        {fight.fight_name}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} container>
                                <Typography noWrap style={{ fontSize: 18, fontWeight: 200 }}>
                                    {fight.fight_desc}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container xs={12}>
                            <Grid xs={6} container>
                                <Box my={3} mb={1}>
                                    <Typography style={{ fontSize: 18, fontWeight: 600 }}>
                                        Đã đăng ký {fight.numbers_std} đội
                                </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={6} container justify="flex-end" alignItems="center">
                                <Box my={3} mb={1}>
                                    <Button variant="contained" onClick={this.handleJoinFight} style={{ backgroundColor: "#E8505B" }}
                                    component={Link} to={`/profile/contest-detail/${fight.id}`}>
                                        <Typography variant="button" style={{ color: "white" }}>Code ngay</Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>
        );
    }
}

export default Fight;