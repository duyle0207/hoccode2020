import React, { Component } from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { Link } from "react-router-dom";

class Course extends Component {
    render() {
        const { name, rating, backgroundImage, id, desc } = this.props;

        return (
            <Grid item xs={12} sm={4} md={4}>
                <Card>
                    <CardMedia
                        style={{ height: '150px' }}
                        image={backgroundImage}
                        title="Contemplative Reptile"
                    />
                    <CardContent container>
                        <Link
                            className="item"
                            key={id}
                            style={{ textDecoration: "none" }}
                            to={`/profile/courses/${id}/tasks`}
                        >
                            <Typography gutterBottom variant="h5" component="h2" style={{ fontWeight: 600, color: "#3B3C54" }}>
                                {name}
                            </Typography>
                        </Link>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <Rating name="read-only" value={rating} precision={0.5} readOnly />
                            </Grid>
                        </Grid>
                        <Grid container xs={12} sm={6} md={6}>
                            <Typography variant="caption"
                            color="textSecondary"
                            component="p"
                            style={{
                              height: 20,
                              overflow: "hidden",
                              wordBreak: "break-word",
                              fontSize: 14,
                            }}
                            >
                                {desc}
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

export default Course;