import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';

class TopUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widthAvt: 0,
            heightAvt: 0,
            medal: '',
        }
    }

    componentDidMount() {
        const { rank } = this.props;
        if (rank === 1 + "st") {
            this.setState({ widthAvt: 100, heightAvt: 100, medal: '#EAA30B' });
        }
        if (rank === 2 + "nd") {
            this.setState({ widthAvt: 80, heightAvt: 80, medal: '#A7B1B1' });
        }
        if (rank === 3 + "rd") {
            this.setState({ widthAvt: 60, heightAvt: 60, medal: '#CB8E66' });
        }
    }

    renderTopUser = () => {
        const { user, rank, leader_board_type, user_fight_info, coding_time } = this.props;
        const { widthAvt, heightAvt, medal } = this.state;
        if (leader_board_type === "general") {
            return <Box display="flex"
                alignItems="flex-end"
                justifyContent="center"
                mt={2}
                css={{ height: 200 }}
            >
                <Box boxShadow={3} style={{ width: '100%' }} bgcolor="white" borderRadius="borderRadius">
                    <Box display="flex" mt={2} justifyContent="center">
                        <Avatar alt="Cindy Baker" style={{ width: widthAvt, height: heightAvt }}
                            src={user.socialAccount === "facebook" || user.socialAccount === "google" ? user.avt : user.avatar} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h5" component="h2">
                            {rank}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="overline" display="block" gutterBottom>
                            {user.firstname + " " + user.lastname}
                        </Typography>
                    </Box>
                    <Box bgcolor={medal} style={{ height: '45px' }} justifyContent="flex-start" alignItems="center">
                        <Box p={1}>
                            <Typography variant="overline" display="block">
                                Điểm: {user.codepoint}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>;
        } else if (leader_board_type === "fight") {
            // return <Box display="flex"
            //     alignItems="center"
            //     justifyContent="center"
            //     mt={2}
            //     css={{ height: 200 }}
            // >
            //     <Box boxShadow={3} style={{ width: '100%' }} bgcolor="white" borderRadius="borderRadius">
            //         <Box display="flex" mt={2} justifyContent="center">
            //             <Avatar alt="Cindy Baker" style={{ width: widthAvt, height: heightAvt }}
            //                 src={user.socialAccount === "facebook" || user.socialAccount === "google" ? user.avt : user.avatar} />
            //         </Box>
            //         <Box display="flex" justifyContent="center">
            //             <Typography variant="h5" component="h2">
            //                 {rank}
            //             </Typography>
            //         </Box>
            //         <Box display="flex" justifyContent="center">
            //             <Typography variant="overline" display="block" gutterBottom>
            //                 {user.firstname + " " + user.lastname}
            //             </Typography>
            //         </Box>
            //         <Box bgcolor={medal} p={1} style={{ height: '47px' }}>
            //             <Grid container xs={12} justify="center" alignItems="center">
            //                 <Grid xs={6} container justify="center" alignItems="center">
            //                     <Box>
            //                         <Typography variant="button" display="block">
            //                             Điểm: {user_fight_info.point}
            //                         </Typography>
            //                     </Box>
            //                 </Grid>
            //                 <Grid xs={6} container justify="center" alignItems="center">
            //                     <Box>
            //                         <Typography variant="button" display="block">
            //                             Thời gian: {coding_time}
            //                         </Typography>
            //                     </Box>
            //                 </Grid>
            //             </Grid>
            //         </Box>
            //     </Box>
            // </Box>;
            return <Box display="flex"
                alignItems="flex-end"
                justifyContent="center"
                mt={4}
                mb={1}
                css={{ height: 200 }}
            >
                <Box boxShadow={3} style={{ width: '100%' }} bgcolor="white" borderRadius="borderRadius">
                    <Box display="flex" mt={2} justifyContent="center">
                        <Avatar alt="Cindy Baker" style={{ width: widthAvt, height: heightAvt }}
                            src={user.socialAccount === "facebook" || user.socialAccount === "google" ? user.avt : user.avatar} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="h5" component="h2">
                            {rank}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Typography variant="overline" display="block" gutterBottom>
                            {user.firstname + " " + user.lastname}
                        </Typography>
                    </Box>
                    <Box bgcolor={medal} display="flex" style={{ height: '45px' }} justifyContent="center" alignItems="center">
                        <Box p={1}>
                            <Typography variant="button" display="block">
                                Điểm: {user_fight_info.point}
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <Typography variant="button" display="block">
                                Thời gian: {coding_time}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>;
        }
    }

    render() {
        // let { user, rank, leader_board_type } = this.props;
        // let { widthAvt, heightAvt, medal } = this.state;
        return (
            <Grid xs={4} justify="center" item>
                {this.renderTopUser()}
            </Grid>
        );
    }
}

export default TopUser;