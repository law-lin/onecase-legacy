import React, { Component } from "react";

import "./profile.css";
import SignOutButton from "./SignOut";
import Navbar from "./Navbar";
import souljason from "../images/souljason.png";

import ProfilePicture from "./ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "./ProfileCard";
import QueryCard from "./QueryCard";
import Biography from "./Biography";
import Username from "./Username";
import EditBio from "./EditBio";
import EditUsername from "./EditUsername";
import { withAuthorization } from "./Session";

class ProfilePage extends Component {
  render() {
    return (
      <div className="bg">
        <Navbar />
        <div className="profile-page">
          <div className="center">
            <div className="profileleft">
              <Biography />
              <EditBio />
              <EditUsername />
              <div className="profile">
                <Username />
                <ProfilePicture />

                <SignOutButton />
              </div>
              <div className="content">
                <Grid container spacing={3}>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="1" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="2" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="3" />
                      </Grid>
                    </React.Fragment>
                  </Grid>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="4" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="5" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="6" />
                      </Grid>
                    </React.Fragment>
                  </Grid>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="7" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="8" />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard cardNumber="9" />
                      </Grid>
                    </React.Fragment>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="profileright">
              <QueryCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(ProfilePage);
