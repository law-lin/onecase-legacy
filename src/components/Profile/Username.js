import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import TextField from "@material-ui/core/TextField";

class Username extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <div>
        {this.props.editable && (
          <TextField
            defaultValue={this.props.username}
            onChange={this.handleChange}
            style={{ backgroundColor: "white", width: "30%" }}
            InputProps={{ disableUnderline: true }}
          />
        )}
        {!this.props.editable && <h2>{this.props.username}</h2>}
      </div>
    );
  }
}

export default withFirebase(Username);
