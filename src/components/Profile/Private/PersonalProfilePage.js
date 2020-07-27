import React, { Component } from "react";

import "../profile.css";
import SignOutButton from "../SignOutButton";
import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";

import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import Button from "@material-ui/core/Button";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
import Username from "../Username";
import Box from "@material-ui/core/Box";
import MediaQuery from "react-responsive";

import { withAuthorization } from "../../Session";

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
    let username = this.props.match.params.username.toString().toLowerCase();

    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
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
                this.setState({
                  oldUsername: state.username,
                  username: state.username,
                });
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
    return (
      <div className="bg">
        <MediaQuery maxDeviceWidth={1224}>
          <Navbar />
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={3} style={{ marginLeft: "5px" }}>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid container item xs={12}>
                      <Grid item xs={8}>
                        {!this.state.loading && (
                          <ProfilePicture
                            profilePicture={this.state.profilePicture}
                            editable={this.state.editing}
                          />
                        )}
                        {!this.state.loading && (
                          <Username
                            display="inline"
                            username={this.state.username}
                            editable={this.state.editing}
                            onChange={this.onUsernameChange}
                          />
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        {!this.state.editing && (
                          <Button onClick={this.handleEdit}>
                            Edit Profile
                          </Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleSave}>Save</Button>
                        )}
                        {this.state.editing && (
                          <Button onClick={this.handleCancel}>Cancel</Button>
                        )}
                        <SignOutButton />
                      </Grid>
                      <Grid item xs={6}>
                        {!this.state.loading && (
                          <Biography
                            margin="0px"
                            bio={this.state.bio}
                            editable={this.state.editing}
                            onChange={this.onBioChange}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        follow
                      </Grid>
                      <Grid item xs={12} align="right">
                        switch
                      </Grid>
                    </Grid>
                  </React.Fragment>
                </Grid>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card1"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card2"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card3"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card4"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card5"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card6"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card7"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card8"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
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
        </MediaQuery>
        <MediaQuery minDeviceWidth={1224}>
          <Navbar />
          <Grid container style={{ marginTop: "10px" }}>
            <Grid item xs={12} sm={2}>
              <LeftNavbar />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Grid container spacing={3} style={{ marginLeft: "5px" }}>
                <Grid justify="center" container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Box clone order={{ xs: 2, sm: 1 }}>
                      <Grid item xs={12} sm={4}>
                        {!this.state.loading && (
                          <Biography
                            margin="25px"
                            bio={this.state.bio}
                            editable={this.state.editing}
                            onChange={this.onBioChange}
                          />
                        )}
                      </Grid>
                    </Box>
                    <Box clone order={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={4} align="center">
                        {!this.state.loading && (
                          <Username
                            username={this.state.username}
                            editable={this.state.editing}
                            onChange={this.onUsernameChange}
                          />
                        )}
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
                          <Button onClick={this.handleEdit}>
                            Edit Profile
                          </Button>
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
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card1"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card2"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card3"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card4"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card5"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card6"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card7"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
                      <ProfileCard
                        username={this.state.username}
                        cardNumber="card8"
                        editable={this.state.editing}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4} align="center">
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
        </MediaQuery>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalProfilePage);
