import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

class User extends Component {
    render() {
        let { user, rank } = this.props;
        return (
            <React.Fragment>
                <Divider light />
                <Box p={1}>
                    <Box display="flex" >
                        <Box p={1} style={{ width: '33%' }}>
                            <Typography gutterBottom variant="overline" component="h2">
                                {rank}
                            </Typography>
                        </Box>
                        <Avatar alt="Cindy Baker" src={user.socialAccount === "facebook" || user.socialAccount === "google" ? user.avt : user.avatar} />
                        <Box p={1} style={{ width: '34%' }}>
                            <Typography gutterBottom variant="overline" component="h2">
                                {user.firstname + " " + user.lastname}
                            </Typography>
                        </Box>
                        <Box p={1} style={{ width: '33%' }}>
                            <Typography gutterBottom variant="overline" component="h2">
                                {user.codepoint}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider light />
            </React.Fragment>
        );
    }
}

export default User;