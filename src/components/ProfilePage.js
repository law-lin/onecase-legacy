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
      card1: null,
      card2: null,
      card3: null,
      card4: null,
      card5: null,
      card6: null,
      card7: null,
      card8: null,
      card9: null,
      cards: [],
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
              card1: state.card1,
              card2: state.card2,
              card3: state.card3,
              card4: state.card4,
              card5: state.card5,
              card6: state.card6,
              card7: state.card7,
              card8: state.card8,
              card9: state.card9,
              loading: false,
            });
          } else {
            this.setState({
              bio: "Edit your bio with the edit button!",
              profilePicture: DefaultProfilePicture,
              loading: false,
              card1: "Edit this card!",
              card2: "Edit this card!",
              card3: "Edit this card!",
              card4: "Edit this card!",
              card5: "Edit this card!",
              card6: "Edit this card!",
              card7: "Edit this card!",
              card8: "Edit this card!",
              card9: "Edit this card!",
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

  onProfileCard1Change = (value) => {
    this.setState({
      cards: this.state.cards.push(value),
    });
  };

  onProfileCard2Change = (value) => {
    this.setState({
      card2: value,
    });
  };

  onProfileCard3Change = (value) => {
    this.setState({
      card3: value,
    });
  };

  onProfileCard4Change = (value) => {
    this.setState({
      card4: value,
    });
  };

  onProfileCard5Change = (value) => {
    this.setState({
      card5: value,
    });
  };

  onProfileCard6Change = (value) => {
    this.setState({
      card6: value,
    });
  };

  onProfileCard7Change = (value) => {
    this.setState({
      card7: value,
    });
  };

  onProfileCard8Change = (value) => {
    this.setState({
      card8: value,
    });
  };

  onProfileCard9Change = (value) => {
    this.setState({
      card9: value,
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
    if (
      this.state.card1 != null &&
      this.state.card2 != null &&
      this.state.card3 != null &&
      this.state.card4 != null &&
      this.state.card5 != null &&
      this.state.card6 != null &&
      this.state.card7 != null &&
      this.state.card8 != null &&
      this.state.card9 != null
    )
      this.props.firebase.editCards(
        this.state.card1,
        this.state.card2,
        this.state.card3,
        this.state.card4,
        this.state.card5,
        this.state.card6,
        this.state.card7,
        this.state.card8,
        this.state.card9
      );
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
                          cardNumber="1"
                          editable={this.state.editing}
                          onChange={this.onProfileCard1Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="2"
                          editable={this.state.editing}
                          onChange={this.onProfileCard2Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="3"
                          editable={this.state.editing}
                          onChange={this.onProfileCard3Change}
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
                          onChange={this.onProfileCard4Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="5"
                          editable={this.state.editing}
                          onChange={this.onProfileCard5Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="6"
                          editable={this.state.editing}
                          onChange={this.onProfileCard6Change}
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
                          onChange={this.onProfileCard7Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="8"
                          editable={this.state.editing}
                          onChange={this.onProfileCard8Change}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ProfileCard
                          username={this.state.username}
                          cardNumber="9"
                          editable={this.state.editing}
                          onChange={this.onProfileCard9Change}
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
