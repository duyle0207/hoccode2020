import React, { Component } from 'react';
import { connect, sendMsg } from "../../api";
import ChatHistory from "../ChatHistory/ChatHistory";

class NormalLeaderBoard extends Component {
    constructor(props) {
        super(props);
        connect();
    
        this.state = ({
          chatHistory: [],
          isLoading: true,
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
    
      send() {
        console.log("hello");
        sendMsg("hello");
      }
    
      render() {
        return (
          <React.Fragment>
            {
              this.state.isLoading ? "Loading" : <ChatHistory chatHistory={this.state.chatHistory} />
            }
            <button onClick={this.send}>Hit</button>
          </React.Fragment>
        );
      }
}

export default NormalLeaderBoard;