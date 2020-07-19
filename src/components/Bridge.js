import React, { Component } from "react";

import PersonalBridge from "./PersonalBridge";
import PublicBridge from "./PublicBridge";
import { withAuthorization } from "./Session";
import DefaultProfilePicture from "../images/default-profile-pic.png";

import * as ROUTES from "../constants/routes";

class Bridge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exists: false,
      personal: false,
      valid: false,
      loading: false,
    };
  }
  componentDidMount() {
    const username = this.props.match.params.username;
    const cardTitle = this.props.match.params.cardTitle;

    this.setState({ loading: true });
    if (!ROUTES.NON_USERNAMES.includes(username)) {
      this.setState({
        valid: true,
      });
      this.props.firebase.currentUser().on("value", (snapshot) => {
        if (snapshot.val().username === username) {
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

      this.props.firebase
        .getIDWithUsername(username)
        .on("value", (snapshot) => {
          const userIDState = snapshot.val();
          console.log(userIDState);
          if (userIDState) {
            this.setState({
              userID: userIDState,
              userIDLoading: false,
            });

            this.props.firebase
              .getCardNumberWithCardTitle(userIDState, cardTitle)
              .on("value", (snapshot) => {
                const state = snapshot.val();
                console.log(state);
                if (state) {
                  this.setState({
                    exists: true,
                    cardNumber: state,
                    cardNumberLoading: false,
                  });
                } else {
                  this.setState({
                    exists: false,
                    cardNumber: null,
                    cardNumberLoading: false,
                  });
                }
              });
            this.props.firebase.user(userIDState).on("value", (snapshot) => {
              const state = snapshot.val();
              if (state) {
                this.setState({
                  profilePicture: state.profilePicture,
                  profilePictureLoading: false,
                });
              } else {
                this.setState({
                  profilePicture: DefaultProfilePicture,
                  profilePictureLoading: false,
                });
              }
            });
          } else {
            this.setState({
              userID: null,
              userIDLoading: false,
            });
          }
        });
    }
  }

  render() {
    if (this.state.valid && this.state.exists) {
      if (!this.state.loading) {
        if (this.state.personal) {
          return <PersonalBridge />;
        } else {
          return <PublicBridge />;
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

export default withAuthorization(condition)(Bridge);
