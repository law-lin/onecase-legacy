import React, { Component } from "react";
import { ButtonBase } from "@material-ui/core";
import DefaultProfilePic from "../images/default-profile-pic.png";
import { withFirebase } from "./Firebase";

import { withStyles } from "@material-ui/core/styles";
const styles = () => ({
  root: {
    width: 350,
    height: 160,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  input: {
    display: "none",
  },
  profilePic: {
    width: 100,
    height: 100,
  },
});

class ProfilePicture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      profilePicture: null,
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .currentUser(this.state.username)
      .on("value", (snapshot) => {
        const state = snapshot.val();
        if (this.state.profilePicture !== undefined) {
          this.setState({
            profilePicture: this.state.profilePicture,
            loading: false,
          });
        } else {
          this.setState({
            profilePicture: DefaultProfilePic,
            loading: false,
          });
        }
      });
  }

  handleChange = (e) => {
    if (e.target.files[0]) {
      const profilePicture = e.target.files[0];
      this.props.firebase.uploadProfilePicture(profilePicture).on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          this.props.firebase.uploadProfilePictureURL(profilePicture);
        }
      );
    }
  };

  render() {
    const { classes } = this.props;
    const { profilePicture } = this.state;
    return (
      <div>
        {this.props.editable && (
          <div>
            <input
              type="file"
              ref={"profile-pic"}
              className={classes.input}
              onChange={this.handleChange}
            />
            <label htmlFor="profile-pic">
              <ButtonBase
                onClick={(e) => {
                  this.refs["profile-pic"].click();
                }}
              >
                <img className={classes.profilePic} src={profilePicture} />
                {/* <span style={{ backgroundImage: profilePicture }} /> */}
              </ButtonBase>
            </label>
          </div>
        )}
        {!this.props.editable && (
          <img className={classes.profilePic} src={profilePicture} />
        )}
      </div>
    );
  }
}
export default withFirebase(withStyles(styles)(ProfilePicture));
