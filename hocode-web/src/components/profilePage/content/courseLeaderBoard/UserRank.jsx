import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

class UserRank extends Component {
    render() {
        let { user, rank, isCurrentUser } = this.props;
        
        return (
            <React.Fragment>
                <Divider light />
                {/* <Box p={1}> */}
                    <Box p={1} display="flex" style={{backgroundColor:  isCurrentUser ? "#F1F1F1" : ""}}>
                        <Box p={1} style={{ width: '10%' }}>
                            <Typography gutterBottom variant="h6" component="h2">
                                {rank}
                            </Typography>
                        </Box>
                        <Avatar alt="Cindy Baker" src={user.socialAccount === "facebook" || user.socialAccount === "google" ? user.user_info.avt : user.user_info.avatar} />
                        <Box p={1} style={{ width: '34%' }}>
                            <Typography gutterBottom variant="h6" component="h2">
                                {user.user_info.firstname + " " + user.user_info.lastname}
                            </Typography>
                        </Box>
                        <Box p={1} style={{ width: '33%' }}>
                            <Typography gutterBottom variant="h6" component="h2">
                                {user.user_point}
                            </Typography>
                        </Box>
                    </Box>
                {/* </Box> */}
                <Divider light />
            </React.Fragment>
        );
    }
}

export default UserRank;