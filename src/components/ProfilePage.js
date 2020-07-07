import React, { Component } from "react";

import "./profile.css";
import SignOutButton from "./SignOut";
import Navbar from "./Navbar";
import souljason from "../images/souljason.png";

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
      username: null,
      editing: false,
      canSave: false,
      canCancel: false,
    };
  }

  componentDidMount() {
    const username = this.props.match.params.username;

    if (username) this.setState({ username: username });
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
    if (this.state.username != null)
      this.props.firebase.editUsername(this.state.username);
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
    console.log(this.state.editing);
    return (
      <div className="bg">
        <Navbar />
        <div className="profile-page">
          <div className="center">
            <div className="profileleft">
              <Biography
                username={this.state.username}
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
                  username={this.state.username}
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
                          cardNumber="1"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="2"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="3"
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
                          cardNumber="4"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="5"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="6"
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
                          cardNumber="7"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="8"
                          editable={this.state.editing}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="9"
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
