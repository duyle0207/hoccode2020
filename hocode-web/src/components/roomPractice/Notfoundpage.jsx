import React, { Component } from 'react';

import {
    Grid,
    CardMedia, Box,
    Typography
} from '@material-ui/core';

class Notfoundpage extends Component {
    render() {
        return (
            <React.Fragment>
                <Box my={5}>
                    <Grid xs={12} sm={12} md={12} container justify="center" alignItems="center" spacing={1}>
                        <Grid xs={12} sm={6} md={6} container justify="flex-end" alignItems="center">
                            <Box p={2}>
                                <CardMedia
                                    component="img"
                                    alt="Contemplative Reptile"
                                    // height="50"
                                    // width="50"
                                    style={{ width: 200, height: 200 }}
                                    src={"https://assets.leetcode.com/static_assets/public/images/404_face.png"}
                                    title="Contemplative Reptile"
                                />
                            </Box>
                        </Grid>
                        <Grid xs={12} sm={6} md={6} container justify="flex-start" alignItems="center">
                            <Box p={2}>
                                <Typography style={{ fontSize: 30, fontWeight: 100 }}>Không thấy nội dung này</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </React.Fragment>
        );
    }
}

export default Notfoundpage;