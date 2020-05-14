import React, { Component } from 'react';
import { connect, sendMsg } from "../../api";
import ChatHistory from "../ChatHistory/ChatHistory";
import {
    TextField,
    Box
} from "@material-ui/core";

class GeneralLeaderBoard extends Component {

    constructor(props) {
        super(props);
        connect();

        this.state = ({
            chatHistory: [],
            isLoading: true,
            meessage: "",
        })
    }

    componentDidMount() {
        console.log("hello")
        connect((msg) => {
            //   console.log(msg)
            //   console.log(msg.data);
            this.setState(prevState => ({
                chatHistory: JSON.parse(msg.data),
                isLoading: false,
            }));
            // console.log(this.state.chatHistory[0].MessageEvent);
        });
    }

    send = () => {
        sendMsg(this.state.meessage);
    }

    handleMessageChange = e => {
        console.log(e.target.value);
        this.setState({
            meessage: e.target.value
        });
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ? "Loading" : <ChatHistory chatHistory={this.state.chatHistory} />
                }
                <Box>
                    <button onClick={this.send}>Hit</button>
                </Box>
                <TextField id="standard-basic" value={this.state.meessage} onChange={this.handleMessageChange} label="Message" />
            </React.Fragment>
        );
    }
}

export default GeneralLeaderBoard;