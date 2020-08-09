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
import Typography from "@material-ui/core/Typography";
import MediaQuery from "react-responsive";
import LeftNavbar from "../../LeftNavbar";
import BottomNavbar from "../../BottomNavbar";

import { withAuthorization } from "../../Session";
import { withFirebase } from "../../Firebase";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1224px",
    maxWidth: "1500px",
  },
});

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
    const { classes } = this.props;

    if (!this.state.loading) {
      if (this.state.exists) {
        return (
          <div className="bg">
            <MediaQuery maxDeviceWidth={1223}>
              <Navbar />
              <Grid container style={{ marginTop: "10px" }}>
                <Grid item xs={12} sm={9}>
                  <Grid container spacing={3}>
                    <Grid justify="center" container item xs={12} spacing={3}>
                      <React.Fragment>
                        <Grid container item xs={12}>
                          <Grid item xs={8}>
                            {!this.state.loading && (
                              <ProfilePicture
                                profilePicture={this.state.profilePicture}
                              />
                            )}
                            {!this.state.loading && (
                              <Username
                                display="inline"
                                username={this.state.username}
                              />
                            )}
                          </Grid>
                          <Grid item xs={4}>
                            follow
                          </Grid>
                          <Grid item xs={6}>
                            {!this.state.loading && (
                              <Biography margin="0px" bio={this.state.bio} />
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
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card2"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card3"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card4"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card5"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card6"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card7"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card8"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card9"
                          />
                        </Grid>
                      </React.Fragment>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  style={{ marginTop: "10px" }}
                  align="center"
                >
                  <LinksCard />
                </Grid>
              </Grid>
              <BottomNavbar />
            </MediaQuery>
            <MediaQuery minDeviceWidth={1224}>
              <Navbar />
              <Grid container className={classes.container}>
                <Grid item xs={12} sm={2}>
                  <LeftNavbar />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <Grid container spacing={5} style={{ marginTop: "40px" }}>
                    <Grid
                      justify="center"
                      container
                      item
                      xs={12}
                      spacing={3}
                      style={{ maxHeight: "200px" }}
                    >
                      <React.Fragment>
                        <Box clone order={{ xs: 2, sm: 1 }}>
                          <Grid item xs={12} sm={4}>
                            {!this.state.loading && (
                              <Biography margin="25px" bio={this.state.bio} />
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
                            <Typography
                              style={{
                                color: "red",
                                fontSize: "20px",
                                fontFamily: ["Montserrat", "sans-serif"],
                              }}
                            >
                              {this.state.error}
                            </Typography>
                          </Grid>
                        </Box>
                      </React.Fragment>
                    </Grid>
                    <Grid justify="center" container item xs={12} spacing={3}>
                      <Grid container item xs={12}>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card1"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card2"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card3"
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12}>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card4"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card5"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card6"
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12}>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card7"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card8"
                          />
                        </Grid>
                        <Grid item xs={6} sm={4} align="center">
                          <ProfileCard
                            username={this.state.username}
                            cardNumber="card9"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={3}
                  style={{ marginTop: "10px" }}
                  align="center"
                >
                  <LinksCard />
                </Grid>
              </Grid>
            </MediaQuery>
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

export default withFirebase(withRouter(withStyles(styles)(PublicProfilePage)));
