import React, { Component } from "react";
import SimpleMDEReact from "react-simplemde-editor";
import {
  Grid,
} from "@material-ui/core";
import "easymde/dist/easymde.min.css";
import "./reactmde.css"

class ReactMde extends Component {
  handleChange = value => {
    this.props.handleMarkdownChange(value);
  };
  render() {
    return (
      <Grid item xs={6} sm={6} >
          <SimpleMDEReact
            style={{width:"1400px"}}
            className={"react_mde_custom"}
            label=""
            value={this.props.mini_task_desc}
            onChange={this.handleChange}
            options={{
              spellChecker: false
            }}
          />
      </Grid>

    );
  }
}

export default ReactMde;
