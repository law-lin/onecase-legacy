import React, { Component } from "react";

import PersonalProfilePage from "./Private/PersonalProfilePage";
import PublicProfilePage from "./Public/PublicProfilePage";
import { withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      personal: false,
      valid: false,
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    let formattedUsername = this.props.match.params.username
      .toString()
      .toLowerCase();

    if (!ROUTES.NON_USERNAMES.includes(formattedUsername)) {
      this.setState({
        valid: true,
      });
      this.props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          this.props.firebase.currentUser().on("value", (snapshot) => {
            console.log(snapshot.val().username.toLowerCase());
            console.log(formattedUsername);
            if (snapshot.val().username.toLowerCase() === formattedUsername) {
              this.setState({
                personal: true,
                loading: false,
              });
            } else {
              this.setState({
                personal: false,
                loading: false,
              });
            }
          });
        } else {
          this.setState({
            personal: false,
            loading: false,
          });
        }
      });
    }
  }

  render() {
    console.log("render profile");
    if (this.state.valid) {
      if (!this.state.loading) {
        if (this.state.personal) {
          return <PersonalProfilePage />;
        } else {
          return <PublicProfilePage />;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

const condition = (authenticated) => !!authenticated;

export default withFirebase(ProfilePage);
