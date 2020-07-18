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
      <div>
        {this.props.editable && (
          <TextField
            label="Biography"
            defaultValue={this.props.bio}
            onChange={this.handleChange}
            multiline
            style={{ backgroundColor: "white", width: "100%" }}
            rows={6}
            rowsMax="6"
            InputProps={{ disableUnderline: true }}
          />
        )}
        {!this.props.editable && <p>{this.props.bio}</p>}
      </div>
    );
  }
}

export default withFirebase(Biography);
