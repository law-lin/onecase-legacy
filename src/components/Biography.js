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
      bio: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.bio(this.state.username).on("value", (snapshot) => {
      const state = snapshot.val();
      if (state) {
        this.setState({
          bio: state.bio,
          loading: false,
        });
      } else {
        this.setState({
          bio: "Edit your bio with the pencil button!",
          loading: false,
        });
      }
    });
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { bio } = this.state;
    return (
      <div className="bio">
        {this.props.editable && (
          <TextField defaultValue={bio} onChange={this.handleChange} />
        )}
        {!this.props.editable && <h2>{bio}</h2>}
      </div>
    );
  }
}

export default withFirebase(Biography);
