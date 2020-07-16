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

import { withAuthorization } from "./Session";

class PublicProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exists: false,
      userID: null,
      username: null,
      profilePicture: null,
      bio: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const username = this.props.match.params.username;

    if (username) this.setState({ oldUsername: username, username });

    this.props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const userIDState = snapshot.val();
      if (userIDState) {
        this.setState({
          userID: userIDState,
        });
        this.props.firebase.user(userIDState).on("value", (snapshot) => {
          const state = snapshot.val();
          if (state) {
            this.setState({
              exists: true,
              bio: state.bio,
              profilePicture: state.profilePicture,
              loading: false,
            });
          }
        });
      } else {
        console.log("didnt find");
        this.setState({
          loading: false,
        });
      }
    });
  }

  render() {
    if (!this.state.loading) {
      if (this.state.exists) {
        return (
          <div className="bg">
            <Navbar />
            <div className="profile-page">
              <div className="center">
                <div className="profileleft">
                  <Biography bio={this.state.bio} />

                  <div className="profile">
                    <Username username={this.state.username} />
                    <ProfilePicture
                      profilePicture={this.state.profilePicture}
                    />
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
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <ProfileCard
                              username={this.state.username}
                              cardNumber="card3"
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
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <ProfileCard
                              username={this.state.username}
                              cardNumber="card5"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <ProfileCard
                              username={this.state.username}
                              cardNumber="card6"
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
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <ProfileCard
                              username={this.state.username}
                              cardNumber="card8"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <ProfileCard
                              username={this.state.username}
                              cardNumber="card9"
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
      return <div>Loading...</div>;
    }
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PublicProfilePage);
