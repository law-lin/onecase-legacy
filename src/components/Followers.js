import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import UsernameButton from "./UsernameButton";

import SignUp from "./SignUp";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

import { withFirebase } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {},
  paper: {
    minWidth: "40vh",
    maxWidth: "50vh",
    minHeight: "70vh",
    maxHeight: "80vh",
  },
  paper: {
    minWidth: "40vh",
    maxWidth: "50vh",
    minHeight: "70vh",
    maxHeight: "80vh",
  },
  header: {
    textAlign: "center",
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      height: "3px",
      bottom: 0,
      left: 0,
    },
  },
  title: {
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "26px",
    fontWeight: 800,
    display: "inline-block",
    verticalAlign: "middle",
    textAlign: "center",
  },
  button: {
    "&:hover": {
      textDecoration: "none",
      color: "#FFFFFF",
    },
    "&:active": {
      outline: "none",
      color: "#adadad",
    },
    "&:focus": {
      outline: "none",
    },
    textDecoration: "none",
    textTransform: "none",
    color: "#FFFFFF",
  },
  name: {
    "&:hover": {
      textDecoration: "none",
      color: "#FFFFFF",
    },
    "&:active": {
      outline: "none",
      color: "#adadad",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    fontSize: "24px",
    color: "#FFFFFF",
  },
  username: {
    color: "#BABABA",
    fontSize: "18px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 600,
  },
  followButton: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#333232",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    color: "#FFFFFF",
    backgroundColor: "#000000",
    textTransform: "none",
    width: "85px",
  },
  followingButton: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#bdbdbd",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    textTransform: "none",
    width: "85px",
  },
  title: {
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "26px",
    fontWeight: 800,
    display: "inline-block",
    verticalAlign: "middle",
    textAlign: "center",
  },
  button: {
    "&:hover": {
      textDecoration: "none",

      color: "#FFFFFF",
    },
    "&:active": {
      outline: "none",
      color: "#adadad",
    },
    "&:focus": {
      outline: "none",
    },
    textDecoration: "none",
    textTransform: "none",
    color: "#FFFFFF",
  },
});

function Followers(props) {
  const [open, setOpen] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    setFollowers(props.followers);
  }, [props.followers]);

  const handleOpen = () => {
    console.log(props.currentUser);
    if (props.currentUser) {
      setOpen(true);
    } else {
      setOpenSignUp(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFollow = (userID) => {
    const newList = followers.map((follower) => {
      if (follower.userID === userID) {
        const updatedFollowing = {
          ...follower,
          isFollowing: true,
        };
        return updatedFollowing;
      }
      return follower;
    });
    setFollowers(newList);

    props.firebase.follow(props.firebase.auth.currentUser.uid, userID);
  };

  const openUnfollowDialog = () => {
    setOpenUnfollow(true);
  };

  const closeUnfollowDialog = () => {
    setOpenUnfollow(false);
  };

  const handleUnfollow = (userID) => {
    closeUnfollowDialog();
    const newList = followers.map((follower) => {
      if (follower.userID === userID) {
        const updatedFollowing = {
          ...follower,
          isFollowing: false,
        };
        return updatedFollowing;
      }
      return follower;
    });
    setFollowers(newList);

    props.firebase.unfollow(props.firebase.auth.currentUser.uid, userID);
  };

  return (
    <React.Fragment>
      <Button className={classes.button} disableRipple onClick={handleOpen}>
        <span style={{ fontWeight: 700 }}>{props.followerCount}</span>
        &nbsp;Followers
      </Button>
      <SignUp
        handleOpen={openSignUp}
        handleClose={() => setOpenSignUp(false)}
      />
      {!loading && (
        <Dialog
          classes={{ paper: classes.paper }}
          PaperProps={{
            style: {
              backgroundColor: "#3E4E55",
              borderRadius: "15px",
            },
          }}
          fullWidth
          open={open}
          onClose={handleClose}
        >
          <DialogTitle className={classes.header}>
            <Typography className={classes.title}>Followers</Typography>
          </DialogTitle>
          <DialogContent style={{ padding: 0 }}>
            <List>
              {followers.map((follower) => {
                return (
                  <ListItem key={follower.userID}>
                    <ListItemAvatar>
                      <Link href={"/" + follower.username}>
                        <Avatar
                          src={follower.profilePicture}
                          style={{ width: "75px", height: "75px" }}
                        />
                      </Link>
                    </ListItemAvatar>
                    <ListItemText
                      style={{ paddingLeft: "10px" }}
                      primary={
                        <Link
                          href={"/" + follower.username}
                          className={classes.name}
                        >
                          {follower.name}
                        </Link>
                      }
                      secondary={
                        <Typography className={classes.username}>
                          @{follower.username}
                        </Typography>
                      }
                    />
                    {follower.userID !==
                      props.firebase.auth.currentUser.uid && (
                      <React.Fragment>
                        {!follower.isFollowing && (
                          <Button
                            className={classes.followButton}
                            onClick={() => handleFollow(follower.userID)}
                          >
                            Follow
                          </Button>
                        )}
                        {follower.isFollowing && (
                          <React.Fragment>
                            <Button
                              className={classes.followingButton}
                              onClick={openUnfollowDialog}
                            >
                              Following
                            </Button>
                            <Dialog
                              open={openUnfollow}
                              onClose={closeUnfollowDialog}
                            >
                              Are you sure you want to unfollow?
                              <Button
                                onClick={() => handleUnfollow(follower.userID)}
                              >
                                Unfollow
                              </Button>
                              <Button onClick={closeUnfollowDialog}>
                                Cancel
                              </Button>
                            </Dialog>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default withFirebase(Followers);
