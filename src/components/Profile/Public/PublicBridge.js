import React, { Component } from "react";

import "../profile.css";
import Navbar from "../../Navbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "../BridgeCard";
import Button from "@material-ui/core/Button";

import Username from "../Username";
import UsernameButton from "../../UsernameButton";
import { withFirebase } from "../../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../../Session";

class PublicBridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      username: null,
      profilePicture: null,
      cardTitle: null,
      cardNumber: null,
      userIDLoading: true,
      cardNumberLoading: true,
      profilePictureLoading: true,
    };
  }

  componentDidMount() {
    if (
      this.state.cardNumberLoading &&
      this.state.userIDLoading &&
      this.state.profilePictureLoading &&
      (this.state.userID == null || this.state.cardNumber == null)
    ) {
      const username = this.props.match.params.username
        .toString()
        .toLowerCase();
      const cardTitle = this.props.match.params.cardTitle;

      const modifiedCardTitle = cardTitle.replace(/_/g, " ");
      if (cardTitle) this.setState({ cardTitle: modifiedCardTitle });
      this.props.firebase
        .getIDWithUsername(username)
        .on("value", (snapshot) => {
          const userIDState = snapshot.val();
          if (userIDState) {
            this.setState({
              userID: userIDState,
              userIDLoading: false,
            });

            this.props.firebase
              .getCardNumberWithCardTitle(userIDState, cardTitle)
              .on("value", (snapshot) => {
                const state = snapshot.val();
                if (state) {
                  this.setState({
                    cardNumber: state,
                    cardNumberLoading: false,
                  });
                } else {
                  this.setState({
                    cardNumber: null,
                    cardNumberLoading: false,
                  });
                }
              });
            this.props.firebase.user(userIDState).on("value", (snapshot) => {
              const state = snapshot.val();
              if (state) {
                this.setState({
                  username: state.username,
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
    return (
      <div className="bg">
        <Navbar />

        <Grid container spacing={3}>
          <Grid justify="center" container item xs={12} spacing={3}>
            <Grid item xs={12} sm={4} align="center">
              <UsernameButton username={this.state.username} />
              <ProfilePicture profilePicture={this.state.profilePicture} />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              align="center"
              style={{ fontSize: "50px", color: "maroon" }}
            >
              {this.state.cardTitle}
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
          </Grid>

          {!this.state.cardNumberLoading && (
            <Grid justify="center" container item xs={12} spacing={3}>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard1"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard2"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard3"
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard4"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="5"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard6"
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard7"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard8"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard9"
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default withFirebase(withRouter(PublicBridge));