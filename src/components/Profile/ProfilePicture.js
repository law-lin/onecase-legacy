import React, { useState, Fragment } from "react";
import { ButtonBase, Typography } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import DefaultProfilePic from "../../images/default-profile-pic.png";
import { withFirebase } from "../Firebase";
import ImageUploader from "react-images-upload";
import Avatar from "react-avatar";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    borderRadius: "50px",
  },
  profilePic: {
    width: 100,
    height: 100,
    verticalAlign: "middle",
  },
  change: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#2D2C2C",
    },
    "&:focus": {
      outline: "none",
    },
    textTransform: "none",
    width: "100px",
    height: "50px",
    fontFamily: ["Montserrat", "sans-serif"],
    color: "#FFFFFF",
    fontSize: "12px",
    position: "absolute",
    bottom: 0,
    background: "#000000",

    opacity: 0.65,
    boxSizing: "border-box",
    borderBottomLeftRadius: "50px",
    borderBottomRightRadius: "50px",
  },
});

function ProfilePicture(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const { profilePicture } = props;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      const profilePicture = e.target.files[0];
      props.firebase.uploadProfilePicture(profilePicture).on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          props.firebase.uploadProfilePictureURL(profilePicture);
        }
      );
    }
  };

  return (
    <React.Fragment>
      {props.editable && (
        <div
          style={{
            display: "inline-flex",
            position: "relative",
            verticalAlign: "middle",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            round="50px"
            style={{ position: "relative" }}
            src={profilePicture}
          ></Avatar>
          <Button className={classes.change} onClick={handleOpen}>
            change profile picture
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth={"lg"}
            PaperProps={{
              style: { backgroundColor: "#E4E4E4" },
            }}
          >
            <DialogTitle></DialogTitle>
            <DialogContent dividers></DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button color="primary">Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      {!props.editable && <Avatar round="50px" src={profilePicture} />}
    </React.Fragment>
  );
}
export default withFirebase(ProfilePicture);
