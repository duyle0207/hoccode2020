import React, { Component } from "react";
import "./ChatHistory.scss";
import LeaderBoard from "../LeaderBoard/LeaderBoard";

class ChatHistory extends Component {

  constructor(props){
    super(props);
    this.state = ({
      data: [],
    })
  }

  componentDidMount() {
    console.log(this.props.chatHistory)
    this.setState({
      data: this.props.chatHistory,
    })
  }

  render() {
    // const { data } = this.state;
    const { chatHistory } = this.props;

    console.log(JSON.stringify(chatHistory.leader_board));

    const result = JSON.parse(JSON.stringify(chatHistory.leader_board));

    console.log(result.length);

    const messages = result.map(v=> (
      <LeaderBoard salary={v.salary} name={v.name} time={v.time}></LeaderBoard>

    ));

    return (
      <div className="ChatHistory">
        <h2>LeaderBoard</h2>
        {messages}
      </div>
    );
  }
}

export default ChatHistory;