import React, { useState, useEffect } from "react";

import verifiedBadge from "../../../images/verified.png";
import "../profile.css";

import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";
import BottomNavbar from "../../BottomNavbar";
import NotFound from "../../NotFound";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";

import ProfilePicture from "../ProfilePicture";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
import Name from "../Name";
import Username from "../Username";
import Followers from "../../Followers.js";
import Following from "../../Following";

import MediaQuery from "react-responsive";

import { withFirebase } from "../../Firebase";
import { useLocation, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Mixpanel } from "../../Mixpanel";

const useStyles = makeStyles({
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
  infoBox: {
    width: "220px",
    height: "120px",
    borderRadius: "15px",
    color: "#FFFFFF",
    backgroundColor: "#3E4E55",
  },
  infoSection: {
    width: "100%",
    borderRadius: 0,
    color: "#FFFFFF",
    backgroundColor: "#7A8489",
    textAlign: "center",
  },
  text: {
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "0.875rem",
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
  center: {
    marginTop: "25px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    maxWidth: "650px",
    backgroundColor: "#232323",
  },
  switch: {
    width: "80px",
    height: "40px",
  },
  switchBase: {
    color: "#000000",
    "&$checked": {
      transform: "translateX(40px)",
      color: "#000000",
      "& + $track": {
        backgroundColor: "#CDAFAF",
      },
    },
  },
  track: {
    opacity: 1,
    backgroundColor: "#CDAFAF",
  },
  checked: {},
  switchLabel: {
    color: "#000000",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 800,
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
});

function PublicProfilePage(props) {
  const [userID, setUserID] = useState(null);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cardCount, setCardCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const [currentUser, setCurrentUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [checked, setChecked] = useState(false);
  const [openUnfollow, setOpenUnfollow] = useState(false);
  const classes = useStyles();

  let location = useLocation();
  let usernameParams = useParams().username.toLowerCase();
  useEffect(() => {
    if (
      location.pathname
        .substring(
          location.pathname.indexOf(usernameParams) + usernameParams.length
        )
        .includes("links")
    ) {
      setChecked(true);
    }
    Mixpanel.track("Profile Visit", { "Profile Name": usernameParams });
    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setCurrentUser(true);
        props.firebase
          .getIDWithUsername(usernameParams)
          .on("value", (snapshot) => {
            const userIDState = snapshot.val();
            if (userIDState) {
              setUserID(userIDState);
              props.firebase.user(userIDState).on("value", (snapshot) => {
                const state = snapshot.val();
                if (state) {
                  setExists(true);
                  setName(state.name);
                  setUsername(state.username);
                  setBio(state.bio);
                  setProfilePicture(state.profilePicture);
                  setCardCount(state.cardCount);
                  setFollowerCount(state.followerCount);
                  setFollowingCount(state.followingCount);
                }
                if (state.isVerified) {
                  setIsVerified(true);
                }
              });
              props.firebase
                .getFollowers(userIDState)
                .once(
                  "value",
                  (snapshot) => {
                    var results = [];
                    return Promise.all(results);
                  },
                  (error) => {
                    console.error(error);
                  }
                )
                .then((snapshot) => {
                  var promises = [];
                  snapshot.forEach((snap) => {
                    var results = [];
                    results.push(
                      props.firebase.user(snap.key).once("value"),
                      props.firebase
                        .checkFollowing(
                          props.firebase.auth.currentUser.uid,
                          snap.key
                        )
                        .once("value")
                    );
                    promises.push(Promise.all(results));
                  });
                  return Promise.all(promises);
                })
                .then((results) => {
                  var followerUsers = [];
                  results.forEach((user) => {
                    let follower = {
                      userID: user[0].key,
                      name: user[0].val().name,
                      username: user[0].val().username,
                      profilePicture: user[0].val().profilePicture,
                      isFollowing: user[1].val(),
                    };
                    followerUsers.push(follower);
                  });
                  setFollowers(followerUsers);
                  setLoading(false);
                });
              props.firebase
                .getFollowing(userIDState)
                .once(
                  "value",
                  (snapshot) => {
                    var results = [];
                    return Promise.all(results);
                  },
                  (error) => {
                    console.error(error);
                  }
                )
                .then((snapshot) => {
                  var promises = [];
                  snapshot.forEach((snap) => {
                    var results = [];
                    results.push(
                      props.firebase.user(snap.key).once("value"),
                      props.firebase
                        .checkFollowing(
                          props.firebase.auth.currentUser.uid,
                          snap.key
                        )
                        .once("value")
                    );
                    promises.push(Promise.all(results));
                  });
                  return Promise.all(promises);
                })
                .then((results) => {
                  var followingUsers = [];
                  results.forEach((user) => {
                    let following = {
                      userID: user[0].key,
                      name: user[0].val().name,
                      username: user[0].val().username,
                      profilePicture: user[0].val().profilePicture,
                      isFollowing: user[1].val(),
                    };
                    followingUsers.push(following);
                  });
                  setFollowings(followingUsers);
                  setLoading(false);
                });

              props.firebase
                .checkFollowing(
                  props.firebase.auth.currentUser.uid,
                  userIDState
                )
                .on("value", (snapshot) => {
                  setIsFollowing(snapshot.val());
                });
            } else {
              setLoading(false);
            }
          });
      } else {
        props.firebase
          .getIDWithUsername(usernameParams)
          .on("value", (snapshot) => {
            const userIDState = snapshot.val();
            if (userIDState) {
              setUserID(userIDState);
              props.firebase.user(userIDState).on("value", (snapshot) => {
                const state = snapshot.val();
                if (state) {
                  setExists(true);
                  setName(state.name);
                  setUsername(state.username);
                  setBio(state.bio);
                  setProfilePicture(state.profilePicture);
                  setCardCount(state.cardCount);
                  setFollowerCount(state.followerCount);
                  setFollowingCount(state.followingCount);
                  setLoading(false);
                }
                if (state.isVerified) {
                  setIsVerified(true);
                }
              });
            } else {
              setLoading(false);
            }
          });
      }
    });
  }, []);

  const handleFollow = () => {
    setIsFollowing(true);
    props.firebase.follow(props.firebase.auth.currentUser.uid, userID);
    Mixpanel.track("Follow", { "Followed UserID": userID });
    Mixpanel.people.increment("Following", 1);
    Mixpanel.people.increment("Amount of Follows", 1);
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    props.firebase.unfollow(props.firebase.auth.currentUser.uid, userID);
    Mixpanel.track("Unfollow", { "Unfollowed UserID": userID });
    Mixpanel.people.increment("Following", -1);
    Mixpanel.people.increment("Amount of Unfollows", 1);
    closeUnfollowDialog();
  };

  const handleSwitch = (event) => {
    setChecked(event.target.checked);
  };

  const openUnfollowDialog = () => {
    setOpenUnfollow(true);
  };

  const closeUnfollowDialog = () => {
    setOpenUnfollow(false);
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
        <ProfilePicture profilePicture={profilePicture} />
        <Typography className={classes.unfollowPrompt}>
          Are you sure you want to unfollow @{username}?
        </Typography>

        <Button className={classes.unfollow} onClick={handleUnfollow}>
          Unfollow
        </Button>
        <Button className={classes.cancel} onClick={closeUnfollowDialog}>
          Cancel
        </Button>
      </Dialog>
    );
  }

  if (!loading) {
    if (exists) {
      return (
        <div className="bg">
          <MediaQuery maxWidth={1114}>
            <React.Fragment>
              <Navbar />
              <Container
                display="flex"
                flexDirection="column"
                style={{ margin: "80px 0", padding: "0 2px" }}
              >
                <Box flex={1} justifyContent="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: "40px" }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      width="100%"
                    >
                      <Box display="flex">
                        <Box>
                          <ProfilePicture profilePicture={profilePicture} />
                        </Box>
                        {!loading && (
                          <Box style={{ marginLeft: "10px" }}>
                            <React.Fragment>
                              <Box display="flex" alignItems="center">
                                <Name name={name} />
                                {isVerified && (
                                  <Tooltip title="Verified User" arrow>
                                    <img
                                      style={{
                                        display: "inline-block",
                                        width: "25px",
                                        marginLeft: "5px",
                                      }}
                                      src={verifiedBadge}
                                      alt="verified badge"
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                              <Username username={username} />
                              {currentUser && (
                                <React.Fragment>
                                  {!isFollowing && (
                                    <CardHeader
                                      style={{
                                        padding: "16px 16px 0 0",
                                        height: "0px",
                                      }}
                                      action={
                                        <Button
                                          className={classes.followButton}
                                          onClick={handleFollow}
                                          style={{
                                            width: "50vw",
                                            maxWidth: "350px",
                                          }}
                                        >
                                          Follow
                                        </Button>
                                      }
                                    />
                                  )}
                                  {isFollowing && (
                                    <React.Fragment>
                                      <CardHeader
                                        style={{
                                          padding: "16px 16px 0 0",
                                          height: "0px",
                                        }}
                                        action={
                                          <Button
                                            className={classes.followButton}
                                            onClick={openUnfollowDialog}
                                            style={{
                                              width: "50vw",
                                              maxWidth: "350px",
                                            }}
                                          >
                                            Unfollow
                                          </Button>
                                        }
                                      />
                                      <UnfollowDialog />
                                    </React.Fragment>
                                  )}
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          </Box>
                        )}
                      </Box>
                      <Box display="flex">
                        <Box flex={1}>
                          <Biography margin="10px" bio={bio} />
                        </Box>
                      </Box>
                      <Box display="flex" flex={1}>
                        <Card className={classes.infoSection}>
                          <Box display="flex" justifyContent="space-evenly">
                            <Box>
                              <Typography
                                className={classes.text}
                                style={{ display: "inline" }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    marginRight: "10px",
                                  }}
                                >
                                  {cardCount}
                                </span>{" "}
                                Entries
                              </Typography>
                            </Box>
                            <Box>
                              <Followers
                                followers={followers}
                                followerCount={followerCount}
                                currentUser={currentUser}
                              />
                            </Box>
                            <Box>
                              <Following
                                following={followings}
                                followingCount={followingCount}
                                currentUser={currentUser}
                              />
                            </Box>
                          </Box>
                        </Card>
                      </Box>
                      <Box display="flex" justifyContent="flex-end">
                        <Box display="flex" flexDirection="column">
                          <Box display="flex">
                            <Box>
                              <Typography
                                className={classes.switchLabel}
                                style={{ paddingRight: "15px" }}
                              >
                                cards
                              </Typography>
                            </Box>
                            <Box>
                              <Typography className={classes.switchLabel}>
                                links
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" justifyContent="center">
                            <Switch
                              classes={{
                                root: classes.switch,
                                switchBase: classes.switchBase,
                                track: classes.track,
                                checked: classes.checked,
                              }}
                              checked={checked}
                              onChange={handleSwitch}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {!checked && (
                      <Container
                        className={classes.center}
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          padding: "0px",
                        }}
                      >
                        <ProfileCard
                          username={username}
                          cardNumber="card1"
                          size="small"
                        />
                        <ProfileCard
                          username={username}
                          cardNumber="card2"
                          size="small"
                        />
                        <ProfileCard
                          username={username}
                          cardNumber="card3"
                          size="small"
                        />
                        <ProfileCard
                          username={username}
                          cardNumber="card4"
                          size="small"
                        />
                        <ProfileCard
                          username={username}
                          cardNumber="card5"
                          size="small"
                        />
                        <ProfileCard
                          username={username}
                          cardNumber="card6"
                          size="small"
                        />
                      </Container>
                    )}
                    {checked && (
                      <Container
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <LinksCard />
                      </Container>
                    )}
                  </Box>
                </Box>
              </Container>
              <BottomNavbar />
            </React.Fragment>
          </MediaQuery>
          <MediaQuery minWidth={1115}>
            <React.Fragment>
              <Navbar />
              <Box display="flex" className={classes.container}>
                <LeftNavbar />

                <Box flex={1} justifyContent="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ marginTop: "40px", width: "700px" }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      width="100%"
                    >
                      <Box
                        flex={1}
                        flexBasis="100%"
                        style={{ paddingLeft: "40px" }}
                      >
                        <Box display="flex" alignItems="center">
                          <Name name={name} />
                          {isVerified && (
                            <Tooltip title="Verified User" arrow>
                              <img
                                style={{
                                  display: "inline-block",
                                  width: "25px",
                                  marginLeft: "5px",
                                }}
                                src={verifiedBadge}
                                alt="verified badge"
                              />
                            </Tooltip>
                          )}
                        </Box>

                        <Username username={username} />
                        <Biography bio={bio} />
                      </Box>
                      <Box
                        flex={1}
                        flexBasis="100%"
                        style={{ textAlign: "center" }}
                      >
                        <ProfilePicture profilePicture={profilePicture} />
                      </Box>
                      <Box
                        display="flex"
                        flex={1}
                        flexBasis="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Card className={classes.infoBox}>
                          {currentUser && (
                            <React.Fragment>
                              {!isFollowing && (
                                <CardHeader
                                  style={{
                                    padding: "16px 16px 0 0",
                                    height: "0px",
                                  }}
                                  action={
                                    <Button
                                      className={classes.followButton}
                                      onClick={handleFollow}
                                    >
                                      Follow
                                    </Button>
                                  }
                                />
                              )}
                              {isFollowing && (
                                <React.Fragment>
                                  <CardHeader
                                    style={{
                                      padding: "16px 16px 0 0",
                                      height: "0px",
                                    }}
                                    action={
                                      <Button
                                        className={classes.followButton}
                                        onClick={openUnfollowDialog}
                                      >
                                        Unfollow
                                      </Button>
                                    }
                                  />
                                  <UnfollowDialog />
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          )}
                          <CardContent style={{ padding: "28px 0 0 10px" }}>
                            <Box display="flex" flexDirection="column">
                              <Box flex={1}>
                                <Typography className={classes.text}>
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      marginRight: "10px",
                                    }}
                                  >
                                    {cardCount}
                                  </span>{" "}
                                  Entries
                                </Typography>
                              </Box>
                              <Box flex={1}>
                                <Followers
                                  followers={followers}
                                  followerCount={followerCount}
                                  currentUser={currentUser}
                                />
                              </Box>
                              <Box flex={1}>
                                <Following
                                  following={followings}
                                  followingCount={followingCount}
                                  currentUser={currentUser}
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </Box>
                    <Container className={classes.center}>
                      <Box display="flex" p={1}>
                        <ProfileCard username={username} cardNumber="card1" />
                        <ProfileCard username={username} cardNumber="card2" />
                      </Box>
                      <Box display="flex" p={1}>
                        <ProfileCard username={username} cardNumber="card3" />
                        <ProfileCard username={username} cardNumber="card4" />
                      </Box>
                      <Box display="flex" p={1}>
                        <ProfileCard username={username} cardNumber="card5" />
                        <ProfileCard username={username} cardNumber="card6" />
                      </Box>
                    </Container>
                  </Box>
                </Box>
                <Box flex={1} justifyContent="center">
                  <Container style={{ margin: "37% 0 0 10%" }}>
                    <LinksCard />
                  </Container>
                </Box>
              </Box>
            </React.Fragment>
          </MediaQuery>
        </div>
      );
    } else {
      return <NotFound />;
    }
  } else {
    return null;
  }
}

export default withFirebase(PublicProfilePage);
