import React, { Component } from "react";

import "../profile.css";
import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import BackButton from "../../BackButton";
import UsernameButton from "../../UsernameButton";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "../BridgeCard";
import Button from "@material-ui/core/Button";
import MediaQuery from "react-responsive";
import Box from "@material-ui/core/Box";

import EditCard from "../EditCard";
import Card from "@material-ui/core/Card";

import Username from "../Username";
import { withStyles } from "@material-ui/core/styles";
import { withAuthorization } from "../../Session";
import NotesCard from "../NotesCard";

const styles = () => ({
  root: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "grey",
    color: "#FFFFFF",
    borderRadius: "15px",
    width: "25%",
    height: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
  },
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
});

class PersonalBridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      username: null,
      profilePicture: null,
      oldCardTitle: null,
      cardTitle: null,
      cardNumber: null,
      notes: "",
      userIDLoading: true,
      cardNumberLoading: true,
      profilePictureLoading: true,
    };
  }

  onNotesChange = (value) => {
    this.setState({
      notes: value,
    });
  };

  handleEdit = () => {
    this.setState({
      editing: true,
      canSave: true,
      canCancel: true,
    });
  };

  handleDone = () => {
    if (this.state.notes !== "")
      this.props.firebase.editNotes(this.state.cardNumber, this.state.notes);
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
      if (cardTitle)
        this.setState({
          oldCardTitle: modifiedCardTitle,
          cardTitle: modifiedCardTitle,
        });
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
                  this.props.firebase
                    .cards(userIDState, state)
                    .on("value", (snapshot) => {
                      const state = snapshot.val();
                      if (state.notes) {
                        this.setState({
                          notes: state.notes,
                          notesLoading: false,
                        });
                      } else {
                        this.setState({
                          notes: "",
                          notesLoading: false,
                        });
                      }
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
                console.log(state.profilePicture);
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
    const { classes } = this.props;
    return (
      <div className="bg">
        <MediaQuery minDeviceWidth={1224}>
          <Navbar />
          <Box display="flex" className={classes.container}>
            <Box flex={1} justifyContent="center">
              <LeftNavbar />
            </Box>
            <Box flex={1} justifyContent="center">
              <Box
                display="flex"
                flexDirection="column"
                style={{ width: "700px" }}
              >
                <Grid
                  container
                  style={{ minHeight: "120px", maxHeight: "200px" }}
                >
                  <Grid container item xs={12} sm={4}>
                    <BackButton username={this.state.username} />
                  </Grid>
                  <Grid container item xs={12} sm={4}>
                    <Card
                      style={{
                        fontFamily: ["Montserrat", "sans-serif"],
                        backgroundColor: "black",
                        color: "#FFFFFF",
                        fontSize: "30px",
                        fontWeight: 800,
                        borderRadius: "15px",
                        alignSelf: "center",
                        width: "100%",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {!this.state.editing && (
                        <span>{this.state.cardTitle}</span>
                      )}
                      {this.state.editing && (
                        <EditCard
                          display="none"
                          username={this.state.username}
                          oldCardTitle={this.state.oldCardTitle}
                          cardTitle={this.state.cardTitle}
                          cardNumber={this.state.cardNumber}
                          bridge={true}
                          editable={true}
                        />
                      )}
                    </Card>
                  </Grid>
                  <Grid container item xs={12} sm={4}>
                    {!this.state.editing && (
                      <Button
                        className={classes.root}
                        onClick={this.handleEdit}
                      >
                        Edit
                      </Button>
                    )}
                    {this.state.editing && (
                      <Button
                        className={classes.root}
                        onClick={this.handleDone}
                      >
                        Done
                      </Button>
                    )}
                  </Grid>
                </Grid>
                {!this.state.cardNumberLoading && (
                  <Box>
                    <Box display="flex" flexDirection="row">
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard1"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard2"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard3"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard4"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard5"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard6"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="row">
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard7"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard8"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                      <Box m={2}>
                        <BridgeCard
                          userID={this.state.userID}
                          username={this.state.username}
                          cardNumber={this.state.cardNumber}
                          bridgeCardNumber="bridgeCard9"
                          editable={this.state.editing}
                          personal={true}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
            <Box flex={1} justifyContent="center" pl={3}>
              <Box
                display="flex"
                flexDirection="column"
                style={{ marginTop: "10px", width: "280px" }}
              >
                <Box style={{ textAlign: "center" }}>
                  <UsernameButton
                    display="block"
                    username={this.state.username}
                  />
                  {!this.state.profilePictureLoading && (
                    <ProfilePicture
                      profilePicture={this.state.profilePicture}
                    />
                  )}
                </Box>
                <Box>
                  {!this.state.notesLoading && (
                    <NotesCard
                      notes={this.state.notes}
                      cardNumber={this.state.cardNumber}
                      editable={this.state.editing}
                      personal={true}
                      onChange={this.onNotesChange}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </MediaQuery>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(withStyles(styles)(PersonalBridge));
