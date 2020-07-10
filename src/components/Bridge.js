import React, { Component } from "react";

import "./profile.css";

import DefaultProfilePicture from "../images/default-profile-pic.png";

import ProfilePicture from "./ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "./BridgeCard";
import Button from "@material-ui/core/Button";

import Username from "./Username";

import { withAuthorization } from "./Session";

class Bridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      profilePicture: null,
      cardTitle: null,
    };
  }
  handleEdit = () => {
    this.setState({
      editing: true,
      canSave: true,
      canCancel: true,
    });
  };

  handleDone = () => {
    this.setState({
      editing: false,
      canSave: false,
      canCancel: false,
    });
  };

  componentDidMount() {
    const username = this.props.match.params.username;
    const cardTitle = this.props.match.params.cardTitle;

    if (username && cardTitle) this.setState({ username, cardTitle });

    console.log(username);
    console.log(cardTitle);

    this.props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const state = snapshot.val();
      if (state) {
        this.setState({
          userID: state,
        });

        this.props.firebase
          .getCardNumberWithCardTitle(this.state.userID, cardTitle)
          .on("value", (snapshot) => {
            console.log(snapshot.val());
          });
        this.props.firebase.user(this.state.userID).on("value", (snapshot) => {
          const state = snapshot.val();
          if (state) {
            this.setState({
              profilePicture: state.profilePicture,
            });
          } else {
            this.setState({
              profilePicture: DefaultProfilePicture,
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

  render() {
    return (
      <div className="bg">
        <Username username={this.state.username} />
        <ProfilePicture profilePicture={this.state.profilePicture} />
        {!this.state.editing && <Button onClick={this.handleEdit}>Edit</Button>}
        {this.state.editing && <Button onClick={this.handleDone}>Done</Button>}
        <div className="content">
          <Grid container spacing={3}>
            <Grid justify="center" container item xs={12} spacing={3}>
              <React.Fragment>
                <Grid item xs={4}>
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card1"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card2"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
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
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card4"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card5"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
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
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card7"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
                    username={this.state.username}
                    cardNumber="card8"
                    editable={this.state.editing}
                  />
                </Grid>
                <Grid item xs={4}>
                  <BridgeCard
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
    );
  }
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(Bridge);
