import React, { Component } from 'react';
import Box from "@material-ui/core/Box";
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import DoneIcon from '@material-ui/icons/Done';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';

class Minitask extends Component {

    renderLevel = (level) => {
        if (level === "easy") {
            return <Chip size="small" label="Đơn giản" style={{ backgroundColor: "#77C148", color: "white" }} />
        } else if (level === "medium") {
            return <Chip size="small" label="Trung bình" style={{ backgroundColor: "#42A5F5", color: "white" }} />
        } else if (level === "hard") {
            return <Chip size="small" label="Phức tạp" style={{ backgroundColor: "#FF7043", color: "white" }} />
        }
    }

    renderStatus = (status) => {
        if (status === "done") {
            return <DoneIcon fontSize="medium" style={{ color: "#449D44" }} />;
        } else if (status === "tried") {
            return <HelpOutlineIcon fontSize="medium" style={{ color: "#0088CC" }} />
        } else if (status === "normal") {
            return "";
        }
    }

    renderChinhPhucButton = (contestStatus, isUserJoinFight, minitask_id) => {
        if (isUserJoinFight) {
            if (contestStatus === 0) {
                return <Box>
                    <Button variant="contained" component={Link} to={`/minitask/${minitask_id}`} style={{ backgroundColor: "#4FA34F", color: "white" }}>
                        <Typography style={{ color: "white", fontWeight: 500 }} >Chinh phục</Typography>
                    </Button>
                </Box>
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    render() {
        var { status, level, name, minitask, } = this.props;

        return (
            <React.Fragment>
                <Box mx={2}>
                    <Divider />
                    <Box my={1}>
                        <Grid container xs={12}>
                            <Grid container item xs={1} sm={1} md={1} alignContent="center" justify="center">
                                {this.renderStatus(status)}
                            </Grid>
                            <Grid item xs={8} sm={8} md={8}>
                                <Grid container mx={2} xs={12}>
                                    <Grid container item xs={12} md={12} sm={12}>
                                        <Typography noWrap style={{ color: "#0373BB", fontWeight: "500", fontSize: 18 }}>{name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container mx={2} xs={12}>
                                    <Grid item xs={4} md={4} sm={4}>
                                        <Typography variant="button">Điểm: {minitask.code_point}</Typography>
                                    </Grid>
                                    <Grid item xs={8} md={8} sm={8}>
                                        <Typography variant="button">Độ khó: </Typography> {this.renderLevel(level)}
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Grid container item xs={3} sm={3} md={3} justify="center" alignContent="center">
                                {
                                    this.renderChinhPhucButton(contestStatus, isUserJoinFight, minitask.id)
                                }
                            </Grid> */}
                        </Grid>
                    </Box>
                    <Divider />
                </Box>
            </React.Fragment>
        );
    }
}

export default Minitask;