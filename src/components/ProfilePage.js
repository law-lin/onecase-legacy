import React, { Component } from "react";

import PersonalProfilePage from "./PersonalProfilePage";
import PublicProfilePage from "./PublicProfilePage";
import { withAuthorization } from "./Session";

import * as ROUTES from "../constants/routes";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: false,
    };
  }
  componentDidMount() {
    if (!ROUTES.NON_USERNAMES.includes(this.props.match.params.username)) {
      console.log(
        ROUTES.NON_USERNAMES.includes(this.props.match.params.username)
      );
      this.setState({
        valid: true,
      });
    }
  }
  render() {
    if (this.state.valid) {
      if (
        this.props.firebase.currentUsername === this.props.match.params.username
      )
        return <PersonalProfilePage />;
      else {
        return <PublicProfilePage />;
      }
    } else {
      return null;
    }
  }
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(ProfilePage);
