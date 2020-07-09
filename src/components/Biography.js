import React, { Component } from "react";

import { withFirebase } from "./Firebase";

import TextField from "@material-ui/core/TextField";
import "./profile.css";

class Biography extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: this.props.username,
      userID: null,
      bio: "",
    };
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { bio } = this.state;
    return (
      <div className="bio">
        {this.props.editable && (
          <TextField
            defaultValue={this.props.bio}
            onChange={this.handleChange}
          />
        )}
        {!this.props.editable && <h2>{this.props.bio}</h2>}
      </div>
    );
  }
}

export default withFirebase(Biography);
