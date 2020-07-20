import React, { Component } from "react";

import "./profile.css";
import Navbar from "./Navbar";
import DefaultProfilePicture from "../images/default-profile-pic.png";

import ProfilePicture from "./ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "./BridgeCard";
import Button from "@material-ui/core/Button";

import Username from "./Username";

import { withAuthorization } from "./Session";

class PersonalBridge extends Component {
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
  handleEdit = () => {
    this.setState({
      editing: true,
      canSave: true,
      canCancel: true,
    });
  };

  handleDone = () => {
    this.setState({
      editing: false,
      canSave: false,
      canCancel: false,
    });
  };

  componentDidMount() {
    if (
      this.state.cardNumberLoading &&
      this.state.userIDLoading &&
      this.state.profilePictureLoading &&
      (this.state.userID == null || this.state.cardNumber == null)
    ) {
      const username = this.props.match.params.username;
      const cardTitle = this.props.match.params.cardTitle;

      const modifiedCardTitle = cardTitle.replace(/_/g, " ");
      console.log("running");
      if (username && cardTitle)
        this.setState({ username, cardTitle: modifiedCardTitle });
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
    console.log(this.state.cardNumberLoading);
    console.log(this.state.cardNumber);
    return (
      <div className="bg">
        <Navbar />

        <Grid container spacing={3}>
          <Grid justify="center" container item xs={12} spacing={3}>
            <Grid item xs={12} sm={4} align="center">
              <Username username={this.state.username} />
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
            <Grid item xs={12} sm={4} align="center">
              {!this.state.editing && (
                <Button onClick={this.handleEdit}>Edit</Button>
              )}
              {this.state.editing && (
                <Button onClick={this.handleDone}>Done</Button>
              )}
            </Grid>
          </Grid>

          {!this.state.cardNumberLoading && (
            <Grid
              justify="center"
              container
              item
              xs={12}
              spacing={3}
              style={{ margin: "0 100px 0 100px" }}
            >
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard1"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard2"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard3"
                      editable={this.state.editing}
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
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="5"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard6"
                      editable={this.state.editing}
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
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard8"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <BridgeCard
                      userID={this.state.userID}
                      username={this.state.username}
                      cardNumber={this.state.cardNumber}
                      bridgeCardNumber="bridgeCard9"
                      editable={this.state.editing}
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
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalBridge);
