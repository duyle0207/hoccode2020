import React, { Component } from 'react';

class LeaderBoard extends Component {
    render() {
        return <div>{this.props.name} || {this.props.salary} || {this.props.time}</div>;
    }
}

export default LeaderBoard;