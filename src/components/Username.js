import React, { Component } from "react";

import { withFirebase } from "./Firebase";

import TextField from "@material-ui/core/TextField";
import "./profile.css";

class Username extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    // this.setState({ loading: true });
    // this.props.firebase.currentUser().on("value", (snapshot) => {
    //   const state = snapshot.val();
    //   this.setState({
    //     username: state.username,
    //     loading: false,
    //   });
    // });
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <div className="username">
        {this.props.editable && (
          <TextField
            defaultValue={this.props.username}
            onChange={this.handleChange}
          />
        )}
        {!this.props.editable && <h2>{this.props.username}</h2>}
      </div>
    );
  }
}

export default withFirebase(Username);
