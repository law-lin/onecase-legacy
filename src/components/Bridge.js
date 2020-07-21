import React, { Component } from "react";

import Navbar from "./Navbar";
import PersonalBridge from "./PersonalBridge";
import PublicBridge from "./PublicBridge";
import { withAuthorization } from "./Session";
import DefaultProfilePicture from "../images/default-profile-pic.png";
import { withFirebase } from "./Firebase";
import * as ROUTES from "../constants/routes";

class Bridge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardNumber: null,
      exists: false,
      personal: false,
      valid: false,
      loading: false,
    };
  }
  componentDidMount() {
    const username = this.props.match.params.username.toString().toLowerCase();
    const cardTitle = this.props.match.params.cardTitle;

    this.setState({ loading: true });
    if (!ROUTES.NON_USERNAMES.includes(username)) {
      this.setState({
        valid: true,
      });
      this.props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          this.props.firebase.currentUser().on("value", (snapshot) => {
            if (snapshot.val().username.toLowerCase() === username) {
              this.setState({
                personal: true,
              });
            } else {
              this.setState({
                personal: false,
              });
            }
          });

          this.props.firebase
            .getIDWithUsername(username)
            .on("value", (snapshot) => {
              const userIDState = snapshot.val();
              if (userIDState) {
                this.props.firebase
                  .getCardNumberWithCardTitle(userIDState, cardTitle)
                  .on("value", (snapshot) => {
                    const state = snapshot.val();
                    console.log(state);
                    if (state) {
                      this.setState({
                        exists: true,
                        loading: false,
                      });
                    } else {
                      this.setState({
                        exists: false,
                        loading: false,
                      });
                    }
                  });
              } else {
                this.setState({
                  exists: false,
                  loading: false,
                });
              }
            });
        } else {
          this.setState({
            personal: false,
          });
          this.props.firebase
            .getIDWithUsername(username)
            .on("value", (snapshot) => {
              const userIDState = snapshot.val();
              if (userIDState) {
                this.props.firebase
                  .getCardNumberWithCardTitle(userIDState, cardTitle)
                  .on("value", (snapshot) => {
                    const state = snapshot.val();
                    if (state) {
                      this.setState({
                        exists: true,
                        loading: false,
                      });
                    } else {
                      this.setState({
                        exists: false,
                        loading: false,
                      });
                    }
                  });
              } else {
                this.setState({
                  exists: false,
                  loading: false,
                });
              }
            });
        }
      });
    }
  }

  render() {
    console.log(this.state.personal);
    if (!this.state.loading && this.state.valid) {
      if (this.state.exists) {
        if (this.state.personal) {
          return <PersonalBridge />;
        } else {
          return <PublicBridge />;
        }
      } else {
        return (
          <div>
            <Navbar />
            <div className="error-screen">
              <div className="error-line">
                Oops, there was an
                <span className="red-error"> error</span>. This page doesn't
                exist!
              </div>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }
  }
}

export default withFirebase(Bridge);
