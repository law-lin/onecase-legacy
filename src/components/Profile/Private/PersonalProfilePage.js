import React, { useState, useEffect } from "react";

import "../profile.css";

import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";

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
import MediaQuery from "react-responsive";

import { withAuthorization } from "../../Session";
import BottomNavbar from "../../BottomNavbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "grey",
    color: "#FFFFFF",
    borderRadius: "15px",
    width: "25%",
    height: "25%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
  save: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#52bf75",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#05872e",
    color: "white",
    borderRadius: "15px",
    width: "25%",
    height: "25%",
    marginRight: "1.5%",
  },
  cancel: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#f07171",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#f03737",
    color: "white",
    borderRadius: "15px",
    width: "25%",
    height: "25%",
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
  editProfile: {
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
});

function PersonalProfilePage(props) {
  const [userID, setUserID] = useState(null);
  const [oldUsername, setOldUsername] = useState(null);
  const [username, setUsername] = useState(null);
  const [oldBio, setOldBio] = useState(null);
  const [bio, setBio] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [canSave, setCanSave] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    let username = props.match.params.username.toString().toLowerCase();

    if (!loading) {
      setLoading(true);
      props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
        const userIDState = snapshot.val();
        if (userIDState) {
          setUserID(userIDState);
          props.firebase.user(userIDState).on("value", (snapshot) => {
            const state = snapshot.val();
            if (state) {
              setOldUsername(state.username);
              setUsername(state.username);
              setUsername(state.username);
              setOldBio(state.bio)
              setBio(state.bio);
              setProfilePicture(state.profilePicture);
              setFollowerCount(state.followerCount);
              setFollowingCount(state.followingCount);
              setLoading(false);
            } 
            else {
              setLoading(false);
            }
          });
        }
        else{
          setLoading(false)
        }
      });
    }
  });

  const onUsernameChange = (value) => {
    setUsername(value);
  };

  const onBioChange = (value) => {
    setBio(value);
  };

  const handleEdit = () => {
    setEditing(true);
    setCanSave(true);
    setCanCancel(true);
  };

  const handleSave = () => {
    let formattedUsername = username.toLowerCase();

    let valid = true;

    if (username === oldUsername) {
      if (bio != null) props.firebase.editBio(bio);
      setEditing(false);
      setCanSave(false);
      setCanCancel(false);
    } else {
      props.firebase
        .checkDuplicateUsername(formattedUsername)
        .on("value", (snapshot) => {
          const usernameRegexp = /^(?=.{1,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/;
          if (usernameRegexp.test(username)) {
            if (!snapshot.exists()) {
              setError(null);
            } else {
              setError("Username is already taken.");
              valid = false;
            }
          } else {
            setError(
              "Please use only letters (a-z, A-Z), numbers, underscores, and periods for username. (1-30 characters)"
            );
            valid = false;
          }
          if (valid) {
            if (
              username !== oldUsername &&
              username !== "" &&
              username != null
            ) {
              props.firebase.editUsername(oldUsername, username);
              window.location.href = "/" + username;
            }

            if (bio != null) props.firebase.editBio(bio);
            setEditing(false);
            setCanSave(false);
            setCanCancel(false);
          }
        });
    }
  };

  const handleCancel = () => {
    setUsername(oldUsername);
    setBio(oldBio);
    setEditing(false);
    setCanSave(false);
    setCanCancel(false);
  };

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
                        <ProfilePicture
                          profilePicture={profilePicture}
                          editable={editing}
                        />
                      )}
                      {!loading && (
                        <Username
                          display="inline"
                          username={username}
                          editable={editing}
                          onChange={onUsernameChange}
                        />
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      {!editing && (
                        <Button className={classes.root} onClick={handleEdit}>
                          Edit
                        </Button>
                      )}
                      {editing && (
                        <Button className={classes.save} onClick={handleSave}>
                          Save
                        </Button>
                      )}
                      {editing && (
                        <Button
                          className={classes.cancel}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      {!loading && (
                        <Biography
                          margin="0px"
                          bio={bio}
                          editable={editing}
                          onChange={onBioChange}
                        />
                      )}
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
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row">
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card1"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card2"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card3"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card4"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card5"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card6"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card7"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card8"
                      editable={editing}
                    />
                  </Box>
                  <Box m={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card9"
                      editable={editing}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            style={{ marginTop: "10px" }}
            align="center"
          >
            <LinksCard editable={editing} />
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
                  {!loading && (
                    <Biography
                      margin="50px"
                      bio={bio}
                      editable={editing}
                      onChange={onBioChange}
                    />
                  )}
                </Box>
                <Box flex={1} flexBasis="100%" style={{ textAlign: "center" }}>
                  {!loading && (
                    <React.Fragment>
                      <Username
                        username={username}
                        editable={editing}
                        onChange={onUsernameChange}
                      />
                      <ProfilePicture
                        profilePicture={profilePicture}
                        editable={editing}
                      />
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
                    {!editing && (
                      <CardHeader
                        style={{ padding: "16px 16px 0 0", height: "0px" }}
                        action={
                          <Button className={classes.editProfile} onClick={handleEdit}>
                            Edit
                          </Button>
                        }
                      ></CardHeader>
                    )}
                    {editing && (
                      <Button className={classes.save} onClick={handleSave}>
                        Save
                      </Button>
                    )}
                    {editing && (
                      <Button className={classes.cancel} onClick={handleCancel}>
                        Cancel
                      </Button>
                    )}
              
                    <CardContent>
                      <Typography className={classes.text}>
                        <span style={{ fontWeight: 700 }}>{followerCount}</span>{" "}
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
                <Box display="flex" alignItems="center" j>
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card1"
                      editable={editing}
                    />
                  </Box>
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card2"
                      editable={editing}
                    />
                  </Box>
                </Box>
                <Box display="flex">
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card3"
                      editable={editing}
                    />
                  </Box>
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card4"
                      editable={editing}
                    />
                  </Box>
                </Box>
                <Box display="flex">
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card5"
                      editable={editing}
                    />
                  </Box>
                  <Box p={2}>
                    <ProfileCard
                      username={username}
                      cardNumber="card6"
                      editable={editing}
                    />
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
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalProfilePage);
