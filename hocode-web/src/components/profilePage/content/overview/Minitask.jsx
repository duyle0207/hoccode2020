import React, { Component } from 'react';
import {
    Box,
    Typography,
    Grid,
    Chip,
    Fade,
    Tooltip,
} from '@material-ui/core';
import { Link } from "react-router-dom";

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

    render() {
        const { minitask } = this.props;
        return (
            <React.Fragment>
                <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                    <Grid item xs={4} md={4} sm={4}>
                        <Box p={3} boxShadow={3}>
                            <Box display="flex" justifyContent="center">
                                <Link
                                    className="item"
                                    style={{ textDecoration: "none" }}
                                    to={`/minitask/${minitask.id}`}
                                >
                                    <Tooltip title={minitask.mini_task_name}>
                                        <Typography variant="h3" style={{ fontSize: 18, fontWeight: 600, color: "#3B3B3B" }}>{minitask.name_func}</Typography>
                                    </Tooltip>
                                </Link>
                            </Box>
                            <Box display="flex" p={2} justifyContent="center">
                                {this.renderLevel(minitask.level)}
                            </Box>
                        </Box>
                    </Grid>
                </Fade>
            </React.Fragment>
        );
    }
}

export default Minitask;