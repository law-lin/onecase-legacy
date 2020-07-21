import React, { Component } from "react";

import "../profile.css";

import Navbar from "../../Navbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import Button from "@material-ui/core/Button";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
import Username from "../Username";
import Box from "@material-ui/core/Box";
import { withAuthorization } from "../../Session";
import { withFirebase } from "../../Firebase";
import { withRouter } from "react-router-dom";

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
    let username = this.props.match.params.username.toString().toLowerCase();

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
              username: state.username,
              bio: state.bio,
              profilePicture: state.profilePicture,
              loading: false,
            });
          }
        });
      } else {
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
            <Grid container style={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={9}>
                <Grid container spacing={3} style={{ marginLeft: "5px" }}>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Box clone order={{ xs: 2, sm: 1 }}>
                        <Grid item xs={12} sm={4}>
                          {!this.state.loading && (
                            <Biography bio={this.state.bio} />
                          )}
                        </Grid>
                      </Box>
                      <Box clone order={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12} sm={4} align="center">
                          {!this.state.loading && (
                            <Username username={this.state.username} />
                          )}
                          {!this.state.loading && (
                            <ProfilePicture
                              profilePicture={this.state.profilePicture}
                            />
                          )}
                        </Grid>
                      </Box>
                      <Box clone order={{ xs: 3, sm: 3 }}>
                        <Grid item xs={12} sm={4} align="center">
                          Follow
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card2"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card3"
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card5"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card6"
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card8"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} align="center">
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="card9"
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

export default withFirebase(withRouter(PublicProfilePage));
