import React, { useState, useEffect } from "react";

import "../profile.css";

import Navbar from "../../Navbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Button from "@material-ui/core/Button";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import ProfileCard from "../ProfileCard";
import LinksCard from "../LinksCard";
import Biography from "../Biography";
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
    marginTop: "40px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    minWidth: "625px",
    maxWidth: "650px",
    minHeight: "450px",
    backgroundColor: "#232323",
  },
});

function PublicProfilePage(props) {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setLoading(true);

    let username = props.match.params.username.toString().toLowerCase();

    props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const userIDState = snapshot.val();
      if (userIDState) {
        setUserID(userIDState);
        props.firebase.user(userIDState).on("value", (snapshot) => {
          const state = snapshot.val();
          if (state) {
            setExists(true);
            setUsername(state.username);
            setBio(state.bio);
            setProfilePicture(state.profilePicture);
            setFollowerCount(state.followerCount);
            setFollowingCount(state.followingCount);
            setLoading(false);
          }
        });
        // props.firebase.getFollowers(userIDState).on("value", (snapshot) => {
        //   setFollowerCount(snapshot.numChildren());
        // });
        props.firebase
          .getFollowing(props.firebase.auth.currentUser.uid, userIDState)
          .on("value", (snapshot) => {
            setIsFollowing(snapshot.val());
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleFollow = () => {
    setIsFollowing(true);
    props.firebase.follow(
      props.firebase.auth.currentUser.uid,
      userID,
      followerCount + 1
    );
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    props.firebase.unfollow(
      props.firebase.auth.currentUser.uid,
      userID,
      followerCount - 1
    );
  };

  if (!loading) {
    if (exists) {
      return (
        <div className="bg">
          <MediaQuery maxDeviceWidth={1223}>
            <Navbar />
            <Grid container style={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={9}>
                <Grid container spacing={3}>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid container item xs={12}>
                        <Grid item xs={8}>
                          {!loading && (
                            <ProfilePicture profilePicture={profilePicture} />
                          )}
                          {!loading && (
                            <Username display="inline" username={username} />
                          )}
                        </Grid>
                        <Grid item xs={4}>
                          follow
                        </Grid>
                        <Grid item xs={6}>
                          {!loading && <Biography margin="0px" bio={bio} />}
                        </Grid>
                        <Grid item xs={6}>
                          follow
                        </Grid>
                        <Grid item xs={12} align="right">
                          switch
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  </Grid>
                  <Grid justify="center" container item xs={12} spacing={3}>
                    <React.Fragment>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card1"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card2"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card3"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card4"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card5"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card6"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card7"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card8"
                          personal={false}
                        />
                      </Grid>
                      <Grid item xs={6} sm={4} align="center">
                        <ProfileCard
                          username={username}
                          cardNumber="card9"
                          personal={false}
                        />
                      </Grid>
                    </React.Fragment>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                style={{ marginTop: "10px" }}
                align="center"
              >
                <LinksCard />
              </Grid>
            </Grid>
            <BottomNavbar />
          </MediaQuery>
          <MediaQuery minDeviceWidth={1224}>
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
                    <Box flex={1} flexBasis="100%">
                      {!loading && <Biography margin="50px" bio={bio} />}
                    </Box>
                    <Box
                      flex={1}
                      flexBasis="100%"
                      style={{ textAlign: "center" }}
                    >
                      {!loading && (
                        <React.Fragment>
                          <Username username={username} />
                          <ProfilePicture profilePicture={profilePicture} />
                        </React.Fragment>
                      )}
                    </Box>
                    <Box
                      display="flex"
                      flex={1}
                      flexBasis="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Card className={classes.infoBox}>
                        {!isFollowing && (
                          <CardHeader
                            style={{ padding: "16px 16px 0 0", height: "0px" }}
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
                            style={{ padding: "16px 16px 0 0", height: "0px" }}
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
                        <CardContent>
                          <Typography className={classes.text}>
                            <span style={{ fontWeight: 700 }}>
                              {followerCount}
                            </span>{" "}
                            Followers
                            <br />
                            <span style={{ fontWeight: 700 }}>
                              {followingCount}
                            </span>{" "}
                            Following
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    className={classes.center}
                  >
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card1" />
                      </Box>
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card2" />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card3" />
                      </Box>
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card4" />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card5" />
                      </Box>
                      <Box p={2}>
                        <ProfileCard username={username} cardNumber="card6" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box flex={1} justifyContent="center">
                <LinksCard />
              </Box>
            </Box>
          </MediaQuery>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
          <div className="error-screen">
            <div className="error-line">
              Oops, there was an
              <span className="red-error"> error</span>. This page doesn't
              exist!
            </div>
          </div>
        </div>
      );
    }
  } else {
    return <div>Loading...</div>;
  }
}

export default withFirebase(withRouter(PublicProfilePage));
