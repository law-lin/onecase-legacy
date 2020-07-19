import React, { Component } from "react";

import "./profile.css";
import SignOutButton from "./SignOut";
import Navbar from "./Navbar";
import souljason from "../images/souljason.png";
import DefaultProfilePicture from "../images/default-profile-pic.png";

import Button from "@material-ui/core/Button";
import ProfilePicture from "./ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "./ProfileCard";
import LinksCard from "./LinksCard";
import Biography from "./Biography";
import Username from "./Username";
import Box from "@material-ui/core/Box";

import EditBio from "./EditBio";
import EditUsername from "./EditUsername";
import { withAuthorization } from "./Session";

class PersonalProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      oldUsername: null,
      username: null,
      profilePicture: null,
      editing: false,
      canSave: false,
      canCancel: false,
      bio: null,
      loading: false,
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;

    if (username) this.setState({ oldUsername: username, username });

    console.log(this.state.loading);
    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
      console.log(username);
      this.props.firebase
        .getIDWithUsername(username)
        .on("value", (snapshot) => {
          const userIDState = snapshot.val();
          console.log(userIDState);
          if (userIDState) {
            this.setState({
              userID: userIDState,
            });
            this.props.firebase.user(userIDState).on("value", (snapshot) => {
              const state = snapshot.val();
              console.log(state);
              if (state) {
                if (state.bio) {
                  this.setState({
                    bio: state.bio,
                  });
                } else {
                  this.setState({
                    bio: "Edit your bio with the edit button!",
                  });
                }
                if (state.profilePicture) {
                  this.setState({
                    profilePicture: state.profilePicture,
                  });
                } else {
                  this.setState({
                    profilePicture: DefaultProfilePicture,
                  });
                }
                this.setState({
                  loading: false,
                });
              } else {
                this.setState({
                  bio: "Edit your bio with the edit button!",
                  profilePicture: DefaultProfilePicture,
                  loading: false,
                });
              }
            });
          } else {
            this.setState({
              userID: null,
            });
          }
        });
    }
  }

  onUsernameChange = (value) => {
    this.setState({
      username: value,
    });
  };

  onBioChange = (value) => {
    this.setState({
      bio: value,
    });
  };

  handleEdit = () => {
    this.setState({
      editing: true,
      canSave: true,
      canCancel: true,
    });
  };

  handleSave = () => {
    if (
      this.state.username !== this.state.oldUsername &&
      this.state.username !== "" &&
      this.state.username != null
    )
      this.props.firebase.editUsername(
        this.state.oldUsername,
        this.state.username
      );
    if (this.state.bio != null) this.props.firebase.editBio(this.state.bio);
    this.setState({
      editing: false,
      canSave: false,
      canCancel: false,
    });
  };

  handleCancel = () => {
    this.setState({
      editing: false,
      canSave: false,
      canCancel: false,
    });
  };

  render() {
    console.log(this.state.bio);
    return (
      <div className="bg">
        <Navbar />
        <Grid container style={{ marginTop: "10px" }}>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={3}>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Box clone order={{ xs: 2, sm: 1 }}>
                    <Grid item xs={12} sm={4} align="center">
                      {!this.state.loading && (
                        <Biography
                          bio={this.state.bio}
                          editable={this.state.editing}
                          onChange={this.onBioChange}
                        />
                      )}
                    </Grid>
                  </Box>
                  <Box clone order={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={4} align="center">
                      <Username
                        username={this.state.username}
                        editable={this.state.editing}
                        onChange={this.onUsernameChange}
                      />
                      {!this.state.loading && (
                        <ProfilePicture
                          profilePicture={this.state.profilePicture}
                          editable={this.state.editing}
                        />
                      )}
                    </Grid>
                  </Box>
                  <Box clone order={{ xs: 3, sm: 3 }}>
                    <Grid item xs={12} sm={4} align="center">
                      {!this.state.editing && (
                        <Button onClick={this.handleEdit}>Edit Profile</Button>
                      )}
                      {this.state.editing && (
                        <Button onClick={this.handleSave}>Save</Button>
                      )}
                      {this.state.editing && (
                        <Button onClick={this.handleCancel}>Cancel</Button>
                      )}
                      <SignOutButton />
                    </Grid>
                  </Box>
                </React.Fragment>
              </Grid>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card1"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card2"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card3"
                      editable={this.state.editing}
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card4"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card5"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card6"
                      editable={this.state.editing}
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
              <Grid justify="center" container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card7"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card8"
                      editable={this.state.editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} align="center">
                    <ProfileCard
                      username={this.state.username}
                      cardNumber="card9"
                      editable={this.state.editing}
                    />
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3} style={{ marginTop: "10px" }}>
            <LinksCard />
          </Grid>
        </Grid>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalProfilePage);
