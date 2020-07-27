import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import TextField from "@material-ui/core/TextField";

class Biography extends Component {
  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
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
        {!this.props.editable && (
          <p style={{ fontSize: "20px", marginLeft: this.props.margin }}>
            {this.props.bio}
          </p>
        )}
      </React.Fragment>
    );
  }
}

export default withFirebase(Biography);
