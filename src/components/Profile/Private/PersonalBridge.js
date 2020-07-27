import React, { Component } from "react";

import "../profile.css";
import Navbar from "../../Navbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import UsernameButton from "../../UsernameButton";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "../BridgeCard";
import Button from "@material-ui/core/Button";
import MediaQuery from "react-responsive";
import LeftNavbar from "../../LeftNavbar";

import Card from "@material-ui/core/Card";

import Username from "../Username";

import { withAuthorization } from "../../Session";
import NotesCard from "../NotesCard";

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
                  username: "",
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
        <MediaQuery minDeviceWidth={1224}>
          <Navbar />
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={2}>
              <LeftNavbar />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={3}>
                <Grid
                  justify="center"
                  container
                  item
                  xs={12}
                  spacing={3}
                  style={{ minHeight: "20vh" }}
                >
                  <React.Fragment>
                    <Grid item xs={12} sm={4}></Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      sm={4}
                      justify="center"
                      align="center"
                      direction="column"
                    >
                      <Card
                        style={{
                          fontFamily: ["Montserrat", "sans-serif"],
                          backgroundColor: "black",
                          color: "white",
                          fontSize: "30px",
                          borderRadius: "15px",
                          width: "100%",
                          height: "50%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {this.state.cardTitle}
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4} align="center">
                      {!this.state.editing && (
                        <Button onClick={this.handleEdit}>Edit</Button>
                      )}
                      {this.state.editing && (
                        <Button onClick={this.handleDone}>Done</Button>
                      )}
                    </Grid>
                  </React.Fragment>
                </Grid>
                {!this.state.cardNumberLoading && (
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard1"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard2"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard3"
                          editable={this.state.editing}
                        />
                      </Grid>
                    </React.Fragment>

                    <React.Fragment>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard4"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="5"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard6"
                          editable={this.state.editing}
                        />
                      </Grid>

                      <Grid item xs={6} sm={4} align="center">
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
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3} align="center">
              <Grid container>
                <Grid item xs={12}>
                  <UsernameButton
                    display="block"
                    username={this.state.username}
                  />
                  <ProfilePicture profilePicture={this.state.profilePicture} />
                </Grid>
                <Grid item xs={12}>
                  <NotesCard
                    cardNumber={this.state.cardNumber}
                    editable={this.state.editing}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MediaQuery>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalBridge);
