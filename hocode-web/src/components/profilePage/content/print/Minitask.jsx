import React, { Component } from 'react';
import Box from "@material-ui/core/Box";
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import DoneIcon from '@material-ui/icons/Done';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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

    render() {
        var { status, level, name, minitask } = this.props;

        return (
            <React.Fragment>
                <Box mx={2}>
                    <Divider />
                    <Box>
                        <Grid container mx={2}>
                                <ListItem button component={props => <Link to={`/minitask/${minitask.id}`} {...props} />}>
                                    <ListItemIcon>
                                        {this.renderStatus(status)}
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="button">{name}</Typography>} />
                                    {this.renderLevel(level)}
                                </ListItem>
                        </Grid>
                    </Box>
                    <Divider />
                </Box>
            </React.Fragment>
        );
    }
}

export default Minitask;