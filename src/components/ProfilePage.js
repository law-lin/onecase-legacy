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
import EditBio from "./EditBio";
import EditUsername from "./EditUsername";
import { withAuthorization } from "./Session";

class ProfilePage extends Component {
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
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;

    if (username) this.setState({ oldUsername: username, username });

    console.log(username);
    this.props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const state = snapshot.val();
      if (state) {
        this.setState({
          userID: state,
        });
        this.props.firebase.user(this.state.userID).on("value", (snapshot) => {
          const state = snapshot.val();
          if (state.bio) {
            this.setState({
              bio: state.bio,
              profilePicture: state.profilePicture,
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
        <Navbar />
        <div className="profile-page">
          <div className="center">
            <div className="profileleft">
              <Biography
                bio={this.state.bio}
                editable={this.state.editing}
                onChange={this.onBioChange}
              />

              <div className="profile">
                <Username
                  username={this.state.username}
                  editable={this.state.editing}
                  onChange={this.onUsernameChange}
                />
                <ProfilePicture
                  profilePicture={this.state.profilePicture}
                  editable={this.state.editing}
                />
                {!this.state.editing && (
                  <Button onClick={this.handleEdit}>Edit</Button>
                )}
                {this.state.editing && (
                  <Button onClick={this.handleSave}>Save</Button>
                )}
                {this.state.editing && (
                  <Button onClick={this.handleCancel}>Cancel</Button>
                )}
                <SignOutButton />
              </div>
              <div className="content">
                <Grid container spacing={3}>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card1"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card2"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
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
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card4"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card5"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
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
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card7"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card8"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card9"
                          editable={this.state.editing}
                        />
                      </Grid>
                    </React.Fragment>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="profileright">
              <LinksCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(ProfilePage);
