import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";
import LeftNavbar from "./LeftNavbar";
import BottomNavbar from "./BottomNavbar";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

import queryString from "query-string";
import { BrowserRouter as useLocation } from "react-router-dom";
import { withFirebase } from "./Firebase";
import { withAuthorization } from "./Session";
import { Mixpanel } from "./Mixpanel";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    padding: 0,
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
  unfollowPrompt: {
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "18px",
    color: "#000000",
    fontWeight: 500,
    padding: "25px 0",
  },
  unfollow: {
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    textDecoration: "none",
    textTransform: "none",
    color: "#FF0000",
    width: "100%",
    padding: "10px",
    height: "60px",
  },
  cancel: {
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    textDecoration: "none",
    textTransform: "none",
    color: "#000000",
    width: "100%",
    padding: "10px",
    height: "60px",
  },
  close: {
    "&:focus": {
      outline: "none",
    },
    color: "#FFFFFF",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

function SearchResults(props) {
  let location = useLocation();
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (queryString.parse(location.search).username === undefined) {
      window.location.href = "/";
    } else {
      props.firebase.auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          Mixpanel.track("Search Query", {
            "Query String": queryString.parse(location.search).username,
          });
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
        }
      });
    }
  }, [props.firebase, location.search]);

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
    Mixpanel.track("Follow", { "Followed UserID": userID });
    Mixpanel.people.increment("Following", 1);
    Mixpanel.people.increment("Amount of Follows", 1);
  };

  const openUnfollowDialog = (userID, username, profilePicture) => {
    setOpenUnfollow(true);
    setUserID(userID);
    setUsername(username);
    setProfilePicture(profilePicture);
  };

  const closeUnfollowDialog = () => {
    setOpenUnfollow(false);
    setUserID(null);
    setUsername(null);
    setProfilePicture(null);
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
    Mixpanel.track("Unfollow", { "Unfollowed UserID": userID });
    Mixpanel.people.increment("Following", -1);
    Mixpanel.people.increment("Amount of Unfollows", 1);
  };

  function UnfollowDialog() {
    return (
      <Dialog
        PaperProps={{
          style: {
            alignItems: "center",
            padding: "50px 50px 20px 50px",
          },
        }}
        open={openUnfollow}
        onClose={closeUnfollowDialog}
      >
        <Avatar
          src={profilePicture}
          style={{ width: "75px", height: "75px" }}
        />
        <Typography className={classes.unfollowPrompt}>
          Are you sure you want to unfollow @{username}?
        </Typography>
        <Button
          className={classes.unfollow}
          onClick={() => handleUnfollow(userID)}
        >
          Unfollow
        </Button>
        <Button className={classes.cancel} onClick={closeUnfollowDialog}>
          Cancel
        </Button>
      </Dialog>
    );
  }

  if (!loading) {
    return (
      <div className="bg">
        <Navbar />
        <Container className={classes.root}>
          <LeftNavbar />
          <Box flex={5}>
            <Container style={{ maxWidth: "700px" }}>
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
                                onClick={() =>
                                  openUnfollowDialog(
                                    result.userID,
                                    result.username,
                                    result.profilePicture
                                  )
                                }
                              >
                                Following
                              </Button>
                              <UnfollowDialog />
                            </React.Fragment>
                          )}
                        </React.Fragment>
                      )}
                  </ListItem>
                ))}
              </List>
            </Container>
          </Box>
        </Container>
        <BottomNavbar />
      </div>
    );
  } else {
    return null;
  }
}

const condition = (authenticated) => !!authenticated;

export default withFirebase(withAuthorization(condition)(SearchResults));
