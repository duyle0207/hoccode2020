import React, { Component } from 'react';

import './App.css';

import { connect, sendMsg } from "./api";
import Header from '../src/components/Header/Header';
import ChatHistory from '../src/components/ChatHistory/ChatHistory';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import GeneralLeaderBoard from "./components/GeneralLeaderBoard/GeneralLeaderBoard";
import NormalLeaderBoard from "./components/NormalLeaderBoard/NormalLeaderBoard";
// import axios from 'axios';

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   connect();

  //   this.state = ({
  //     chatHistory: [],
  //     isLoading: true,
  //   })
  // }

  // componentDidMount() {
  //   connect((msg) => {
  //     console.log("[Nhận nè]")
  //     // console.log(msg.data);
  //     this.setState(prevState => ({
  //       chatHistory: JSON.parse(msg.data),
  //       isLoading: false,
  //     }));
  //     // console.log(this.state.chatHistory[0].MessageEvent);
  //   });
  // }

  // send() {
  //   console.log("hello");
  //   sendMsg("hello");
  // }

  render() {
    return (
      <React.Fragment>
        {/* <div className="App">
          <Header />
          <button onClick={this.send}>Hit</button>
        </div>
        {
          this.state.isLoading ? "Loading" : <ChatHistory chatHistory={this.state.chatHistory} />
        } */}
        <Router>
          <Switch>
            <Route path="/general-leaderboard" exact component={GeneralLeaderBoard} />
          </Switch>
          <Switch>
            <Route path="/normal-leaderboard" exact component={NormalLeaderBoard} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
