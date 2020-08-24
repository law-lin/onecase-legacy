import React, { useState, useEffect } from "react";

import verifiedBadge from "../../../images/verified.png";
import "../profile.css";
import Navbar from "../../Navbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";
import NotFound from "../../NotFound";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Followers from "../../Followers.js";
import Following from "../../Following";

import Tooltip from "@material-ui/core/Tooltip";
import Container from "@material-ui/core/Container";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
import Name from "../Name";
import Username from "../Username";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import MediaQuery from "react-responsive";
import LeftNavbar from "../../LeftNavbar";
import BottomNavbar from "../../BottomNavbar";

import { size } from "lodash";

import { withAuthorization } from "../../Session";
import { withFirebase } from "../../Firebase";
import { withRouter } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { setDisplayName } from "recompose";

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
  text: {
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "16px",
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
});

function PublicProfilePage(props) {
  const [userID, setUserID] = useState(null);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const [currentUser, setCurrentUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  const [checked, setChecked] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    let username = props.match.params.username.toString().toLowerCase();

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setCurrentUser(true);
        props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
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
            // props.firebase.getFollowers(userIDState).on("value", (snapshot) => {
            //   setFollowerCount(snapshot.numChildren());
            // });
            props.firebase
              .checkFollowing(props.firebase.auth.currentUser.uid, userIDState)
              .on("value", (snapshot) => {
                setIsFollowing(snapshot.val());
              });
          } else {
            setLoading(false);
          }
        });
      } else {
        props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
          const userIDState = snapshot.val();
          if (userIDState) {
            console.log(userIDState);
            setUserID(userIDState);
            props.firebase.user(userIDState).on("value", (snapshot) => {
              const state = snapshot.val();
              console.log(snapshot.val());
              if (state) {
                setExists(true);
                setName(state.name);
                setUsername(state.username);
                setBio(state.bio);
                setProfilePicture(state.profilePicture);
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
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    props.firebase.unfollow(props.firebase.auth.currentUser.uid, userID);
  };

  const handleSwitch = (event) => {
    setChecked(event.target.checked);
  };

  if (!loading) {
    if (exists) {
      return (
        <div className="bg">
          <MediaQuery maxWidth={1114}>
            {!loading && (
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
                              </React.Fragment>
                            </Box>
                          )}
                        </Box>
                        <Box display="flex">
                          <Box flex={1}>
                            {!loading && <Biography margin="10px" bio={bio} />}
                          </Box>

                          <Box
                            display="flex"
                            flex={1}
                            justifyContent="flex-end"
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
                                    <CardHeader
                                      style={{
                                        padding: "16px 16px 0 0",
                                        height: "0px",
                                      }}
                                      action={
                                        <Button
                                          className={classes.followButton}
                                          onClick={handleUnfollow}
                                        >
                                          Unfollow
                                        </Button>
                                      }
                                    />
                                  )}
                                </React.Fragment>
                              )}
                              <CardContent style={{ padding: "28px 0 0 10px" }}>
                                <Typography className={classes.text}>
                                  <Followers
                                    followers={followers}
                                    followerCount={followerCount}
                                    currentUser={currentUser}
                                  />
                                  <br />
                                  <Following
                                    following={followings}
                                    followingCount={followingCount}
                                    currentUser={currentUser}
                                  />
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
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
            )}
          </MediaQuery>
          <MediaQuery minWidth={1115} maxWidth={1399}>
            {!loading && (
              <React.Fragment>
                <Navbar />
                <Box display="flex" className={classes.container}>
                  <Box justifyContent="center">
                    <LeftNavbar noText={true} />
                  </Box>
                  <Box justifyContent="center">
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
                                  <CardHeader
                                    style={{
                                      padding: "16px 16px 0 0",
                                      height: "0px",
                                    }}
                                    action={
                                      <Button
                                        className={classes.followButton}
                                        onClick={handleUnfollow}
                                      >
                                        Unfollow
                                      </Button>
                                    }
                                  />
                                )}
                              </React.Fragment>
                            )}
                            <CardContent style={{ padding: "28px 0 0 10px" }}>
                              <Typography className={classes.text}>
                                <Followers
                                  followers={followers}
                                  followerCount={followerCount}
                                  currentUser={currentUser}
                                />
                                <br />
                                <Following
                                  following={followings}
                                  followingCount={followingCount}
                                  currentUser={currentUser}
                                />

                                {/* <ModalRoute
                              path={`/${username}/followers`}
                              component={() => (
                                <Followers followers={followers} />
                              )}
                            />
                            <ModalRoute
                              path={`/${username}/following`}
                              component={Following}
                            /> */}
                              </Typography>
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
                  <Box justifyContent="center">
                    <Container style={{ margin: "37% 0 0 10%" }}>
                      <LinksCard />
                    </Container>
                  </Box>
                </Box>
              </React.Fragment>
            )}
          </MediaQuery>
          <MediaQuery minWidth={1400}>
            {!loading && (
              <React.Fragment>
                <Navbar />
                <Box display="flex" className={classes.container}>
                  <Box flex={1} justifyContent="center">
                    <LeftNavbar />
                  </Box>
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
                                  <CardHeader
                                    style={{
                                      padding: "16px 16px 0 0",
                                      height: "0px",
                                    }}
                                    action={
                                      <Button
                                        className={classes.followButton}
                                        onClick={handleUnfollow}
                                      >
                                        Unfollow
                                      </Button>
                                    }
                                  />
                                )}
                              </React.Fragment>
                            )}
                            <CardContent style={{ padding: "28px 0 0 10px" }}>
                              <Typography className={classes.text}>
                                <Followers
                                  followers={followers}
                                  followerCount={followerCount}
                                  currentUser={currentUser}
                                />
                                <br />
                                <Following
                                  following={followings}
                                  followingCount={followingCount}
                                  currentUser={currentUser}
                                />
                              </Typography>
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
            )}
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

export default withFirebase(withRouter(PublicProfilePage));
