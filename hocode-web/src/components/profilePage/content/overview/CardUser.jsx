import React, { Component } from 'react';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import CardMedia from '@material-ui/core/CardMedia';

class CardUser extends Component {
    render() {
        const { user } = this.props;
        return (
            <React.Fragment>
                <Fade in={true} {...(true ? { timeout: 1500 } : {})}>
                    <Grid container xs={12} spacing={2}>
                        <Grid item xs={3}>
                            <CardMedia
                                style={{ borderRadius: '50%' }}
                                component="img"
                                alt="avatar"
                                width="65"
                                height="65"
                                src={(user.socialAccount === "google" || user.socialAccount === "facebook") ? user.avt : user.avatar}
                                title="Contemplative Reptile"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Typography gutterBottom variant="button" component="h2">
                                {user.firstname + " " + user.lastname}
                            </Typography>
                            <Typography gutterBottom variant="h5" component="h2" style={{ color: "#DB3B56", fontWeight: "800" }}>
                                {user.codepoint} điểm
                        </Typography>
                        </Grid>
                    </Grid>
                </Fade>
            </React.Fragment>
        );
    }
}

export default CardUser;