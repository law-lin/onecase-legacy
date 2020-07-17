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
    const { classes, profilePicture } = this.props;

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
                <img
                  className={classes.profilePic}
                  src={DefaultProfilePic}
                  alt="profile pic"
                />
                {/* <span style={{ backgroundImage: profilePicture }} /> */}
              </ButtonBase>
            </label>
          </div>
        )}
        {!this.props.editable && (
          <img
            className={classes.profilePic}
            src={profilePicture}
            alt="profile pic"
          />
        )}
      </div>
    );
  }
}
export default withFirebase(withStyles(styles)(ProfilePicture));
