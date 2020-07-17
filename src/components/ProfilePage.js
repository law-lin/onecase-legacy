import React, { Component } from "react";

import PersonalProfilePage from "./PersonalProfilePage";
import PublicProfilePage from "./PublicProfilePage";
import { withAuthorization } from "./Session";

import * as ROUTES from "../constants/routes";

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
    if (!ROUTES.NON_USERNAMES.includes(this.props.match.params.username)) {
      this.setState({
        valid: true,
      });
      this.props.firebase.currentUser().on("value", (snapshot) => {
        if (snapshot.val().username === this.props.match.params.username) {
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
    }
  }

  render() {
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

export default withAuthorization(condition)(ProfilePage);
