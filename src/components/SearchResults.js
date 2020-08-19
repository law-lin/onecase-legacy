import React, { useState, useEffect } from "react";
import UsernameButton from "./UsernameButton";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

import Navbar from "./Navbar";
import LeftNavbar from "./LeftNavbar";

import queryString from "query-string";
import { BrowserRouter as Router, Switch, useLocation } from "react-router-dom";
import { withFirebase } from "./Firebase";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
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
      color: "#525252",
    },
    "&:active": {
      outline: "none",
      color: "#6b6b6b",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    fontSize: "24px",
    color: "#000000",
  },
  username: {
    color: "#1c1c1c",
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
    color: "#000000",
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

function SearchResults(props) {
  let location = useLocation();
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);

  const [currentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    setLoading(true);

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setCurrentUser(true);
        props.firebase
          .searchUsernames(
            queryString.parse(location.search).username.toLowerCase()
          )
          .once("value")
          .then((snapshot) => {
            var promises = [];
            snapshot.forEach((snap) => {
              var results = [];
              results.push(
                props.firebase.user(snap.val()).once("value"),
                props.firebase
                  .checkFollowing(
                    props.firebase.auth.currentUser.uid,
                    snap.val()
                  )
                  .once("value")
              );
              promises.push(Promise.all(results));
            });
            return Promise.all(promises);
          })
          .then((results) => {
            var usernames = [];
            results.forEach((result) => {
              let user = {
                userID: result[0].key,
                name: result[0].val().name,
                username: result[0].val().username,
                profilePicture: result[0].val().profilePicture,
                isFollowing: result[1].val(),
              };
              usernames.push(user);
            });
            props.firebase
              .searchNames(
                queryString.parse(location.search).username.toLowerCase()
              )
              .once("value")
              .then((snapshot) => {
                var promises = [];
                snapshot.forEach((snap) => {
                  var results = [];
                  results.push(
                    props.firebase.user(snap.val()).once("value"),
                    props.firebase
                      .checkFollowing(
                        props.firebase.auth.currentUser.uid,
                        snap.val()
                      )
                      .once("value")
                  );
                  promises.push(Promise.all(results));
                });
                return Promise.all(promises);
              })
              .then((results) => {
                results.forEach((result) => {
                  let user = {
                    userID: result[0].key,
                    name: result[0].val().name,
                    username: result[0].val().username,
                    profilePicture: result[0].val().profilePicture,
                    isFollowing: result[1].val(),
                  };
                  usernames.push(user);
                });
                // eliminate duplicate results
                let jsonObject = usernames.map(JSON.stringify);
                let uniqueSet = new Set(jsonObject);
                let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                setResults(uniqueArray);
                setLoading(false);
              });
          });
      } else {
        props.firebase
          .searchUsernames(
            queryString.parse(location.search).username.toLowerCase()
          )
          .once("value")
          .then((snapshot) => {
            var promises = [];
            snapshot.forEach((snap) => {
              promises.push(props.firebase.user(snap.val()).once("value"));
            });
            return Promise.all(promises);
          })
          .then((results) => {
            var usernames = [];
            results.forEach((result) => {
              let user = {
                userID: result.key,
                name: result.val().name,
                username: result.val().username,
                profilePicture: result.val().profilePicture,
              };
              usernames.push(user);
            });
            // eliminate duplicate results
            let jsonObject = usernames.map(JSON.stringify);
            let uniqueSet = new Set(jsonObject);
            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
            setResults(uniqueArray);
            setLoading(false);
          });
      }
    });
  }, []);

  const handleFollow = (userID) => {
    const newList = results.map((user) => {
      if (user.userID === userID) {
        const updatedList = {
          ...user,
          isFollowing: true,
        };
        return updatedList;
      }
      return user;
    });
    setResults(newList);
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
    const newList = results.map((user) => {
      if (user.userID === userID) {
        const updatedList = {
          ...user,
          isFollowing: false,
        };
        return updatedList;
      }
      return user;
    });
    setResults(newList);
    props.firebase.unfollow(props.firebase.auth.currentUser.uid, userID);
  };

  if (!loading) {
    return (
      <div className="bg">
        <Navbar />
        <Box display="flex" className={classes.root}>
          <Box flex={1}>
            <LeftNavbar />
          </Box>
          <Box flex={1}>
            <Container style={{ width: "700px" }}>
              <Typography className={classes.title}>
                Search Results for {queryString.parse(location.search).username}
              </Typography>
              <List>
                {results.map((result) => (
                  <ListItem key={result.userID}>
                    <ListItemAvatar>
                      <Link href={"/" + result.username}>
                        <Avatar
                          src={result.profilePicture}
                          style={{ width: "75px", height: "75px" }}
                        />
                      </Link>
                    </ListItemAvatar>
                    <ListItemText
                      style={{ paddingLeft: "10px" }}
                      primary={
                        <Link
                          href={"/" + result.username}
                          className={classes.name}
                        >
                          {result.name}
                        </Link>
                      }
                      secondary={
                        <Typography className={classes.username}>
                          @{result.username}
                        </Typography>
                      }
                    />
                    {currentUser &&
                      result.userID !== props.firebase.auth.currentUser.uid && (
                        <React.Fragment>
                          {!result.isFollowing && (
                            <Button
                              className={classes.followButton}
                              onClick={() => handleFollow(result.userID)}
                            >
                              Follow
                            </Button>
                          )}
                          {result.isFollowing && (
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
                                  onClick={() => handleUnfollow(result.userID)}
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
                ))}
              </List>
            </Container>
          </Box>
          <Box flex={1}></Box>
        </Box>
      </div>
    );
  } else {
    return null;
  }
}

export default withFirebase(SearchResults);
