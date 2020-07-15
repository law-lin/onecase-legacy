import React, { Component } from "react";

import PersonalProfilePage from "./PersonalProfilePage";
import PublicProfilePage from "./PublicProfilePage";
import { withAuthorization } from "./Session";
import { withFirebase } from "./Firebase";
class ProfilePage extends Component {
  render() {
    if (
      this.props.firebase.currentUsername === this.props.match.params.username
    )
      return <PersonalProfilePage />;
    else {
      return <PublicProfilePage />;
    }
  }
}

const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(ProfilePage);
