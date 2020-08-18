import React, { useState, useEffect } from "react";

import "../profile.css";
import { ModalContainer, ModalRoute } from "react-router-modal";

import Feed from "../../FeedPage";
import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import Followers from "../../Followers.js";
import Following from "../../Following";

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
import Name from "../Name";
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
    fontFamily: ["Mukta Mahee", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#242424",
    color: "#FFFFFF",
    borderRadius: "15px",
    width: "15%",
    height: "25%",
    display: "inline-block",
    verticalAlign: "middle",
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
    marginTop: "25px",
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
      backgroundColor: "#b5b5b5",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    textTransform: "none",
    width: "fit-content",
  },
  header: {
    backgroundColor: "#4B4B4B",
  },
  title: {
    width: "fit-content",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "26px",
    fontWeight: 800,
    display: "inline-block",
    verticalAlign: "middle",
  },
  dialogPaper: {
    minWidth: "40vh",
    maxWidth: "50vh",
    minHeight: "70vh",
    maxHeight: "80vh",
  },
  box: {
    color: "#C8C8C8",
    backgroundColor: "#3E4E55",
    alignItems: "center",
    justifyContent: "center",
    height: "90px",
    width: "410px",
    borderRadius: "10px",
  },
  textField: {
    backgroundColor: "#ADB0B1",
    borderRadius: "3px",
    display: "block",
  },
  bio: {
    color: "#C8C8C8",
    backgroundColor: "#3E4E55",
    alignItems: "center",
    justifyContent: "center",
    height: "150px",
    width: "410px",
    borderRadius: "10px",
  },
  link: {
    color: "#C8C8C8",
    backgroundColor: "#3E4E55",
    alignItems: "center",
    justifyContent: "center",
    height: "180px",
    width: "410px",
    borderRadius: "10px",
  },
  input: {
    lineHeight: 1,
    padding: "5px",
    color: "#FFFFFF",
    fontSize: "24px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
  },
  label: {
    color: "#C8C8C8",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontSize: "20px",
  },
  characterLimit: {
    textAlign: "right",
    color: "#C8C8C8",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontSize: "12x",
  },
  modal: {
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

function PersonalProfilePage(props) {
  const [userID, setUserID] = useState(null);
  const [oldUsername, setOldUsername] = useState(null);
  const [username, setUsername] = useState("");
  const [oldName, setOldName] = useState(null);
  const [name, setName] = useState("");
  const [oldBio, setOldBio] = useState(null);
  const [bio, setBio] = useState("");
  const [oldProfilePicture, setOldProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [savedImage, setSavedImage] = useState(null);
  const [canSave, setCanSave] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);

  const [link1Title, setLink1Title] = useState("");
  const [link2Title, setLink2Title] = useState("");
  const [link3Title, setLink3Title] = useState("");

  const [link1URL, setLink1URL] = useState(null);
  const [link2URL, setLink2URL] = useState(null);
  const [link3URL, setLink3URL] = useState(null);

  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const classes = useStyles();

  let location = useLocation();
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
              setOldName(state.name);
              setName(state.name);
              setOldUsername(state.username);
              setUsername(state.username);
              setOldBio(state.bio);
              setBio(state.bio);
              setOldProfilePicture(state.profilePicture);
              setProfilePicture(state.profilePicture);
              setFollowerCount(state.followerCount);
              setFollowingCount(state.followingCount);

              if (state.linkCard1) {
                setLink1Title(state.linkCard1.linkTitle);
                setLink1URL(state.linkCard1.linkURL);
              }
              if (state.linkCard2) {
                setLink2Title(state.linkCard2.linkTitle);
                setLink2URL(state.linkCard2.linkURL);
              }
              if (state.linkCard3) {
                setLink3Title(state.linkCard3.linkTitle);
                setLink3URL(state.linkCard3.linkURL);
              }

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
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });
    }
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleClose = () => {
    setEditing(false);
  };

  const handleProfilePictureChange = (value) => {
    setProfilePicture(value);
  };

  const handleSave = () => {
    let formattedUsername = username.toLowerCase();

    let valid = true;

    if (username === oldUsername) {
      if (bio != null) props.firebase.editBio(bio);
      if (name != null) props.firebase.editName(name);
      if (link1Title && link1URL) {
        updateLink("linkCard1", link1Title, link1URL);
      }
      if (link2Title && link2URL) {
        updateLink("linkCard2", link2Title, link2URL);
      }
      if (link3Title && link3URL) {
        updateLink("linkCard3", link3Title, link3URL);
      }
      if (profilePicture !== null) {
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
      handleClose();
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
            if (name != null) props.firebase.editName(name);
            if (link1Title && link1URL) {
              updateLink("linkCard1", link1Title, link1URL);
            }
            if (link2Title && link2URL) {
              updateLink("linkCard2", link2Title, link2URL);
            }
            if (link3Title && link3URL) {
              updateLink("linkCard3", link3Title, link3URL);
            }
            if (profilePicture !== null) {
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
            setEditing(false);
          }
        });
      handleClose();
    }
  };

  const updateLink = (linkCardNumber, linkTitle, linkURL) => {
    const urlregexp = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    if (urlregexp.test(linkURL)) {
      if (!~linkURL.indexOf("http")) {
        props.firebase.editLinkCard(
          linkCardNumber,
          linkTitle,
          "http://" + linkURL
        );
      } else {
        props.firebase.editLinkCard(linkCardNumber, linkTitle, linkURL);
      }
      handleClose();
    } else {
      setError("Please enter a valid URL!");
    }
  };

  return (
    <div className="bg">
      <MediaQuery maxDeviceWidth={1223}>
        {!loading && (
          <React.Fragment>
            <Navbar />
            <Box display="flex" className={classes.container}>
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
                      {!loading && <Biography margin="50px" bio={oldBio} />}
                    </Box>
                    <Box
                      flex={1}
                      flexBasis="100%"
                      style={{ textAlign: "center" }}
                    >
                      {!loading && (
                        <React.Fragment>
                          <Username username={oldUsername} />
                          <ProfilePicture profilePicture={oldProfilePicture} />
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
                        <CardHeader
                          style={{ padding: "16px 16px 0 0", height: "0px" }}
                          action={
                            <Button
                              className={classes.editProfile}
                              onClick={handleEdit}
                            >
                              Edit Profile
                            </Button>
                          }
                        ></CardHeader>

                        <Dialog
                          classes={{ paper: classes.dialogPaper }}
                          PaperProps={{
                            style: {
                              backgroundColor: "#242424",
                              borderRadius: "15px",
                            },
                          }}
                          onClose={handleClose}
                          fullWidth
                          open={editing}
                        >
                          <DialogTitle className={classes.header}>
                            <Typography className={classes.title}>
                              Edit Profile
                            </Typography>
                            <Button
                              className={classes.save}
                              onClick={handleSave}
                            >
                              Save
                            </Button>
                          </DialogTitle>
                          <DialogContent>
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Box p={3}>
                                <ProfilePicture
                                  profilePicture={oldProfilePicture}
                                  newProfilePicture={profilePicture}
                                  editable={editing}
                                  onChange={handleProfilePictureChange}
                                />
                              </Box>
                              <Box p={3}>
                                <Container className={classes.box}>
                                  <Typography className={classes.label}>
                                    Username
                                  </Typography>
                                  <TextField
                                    name="username"
                                    type="text"
                                    className={classes.textField}
                                    defaultValue={username}
                                    onChange={(e) =>
                                      setUsername(e.target.value)
                                    }
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    helperText={error}
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.box}>
                                  <Typography className={classes.label}>
                                    Name
                                  </Typography>
                                  <TextField
                                    name="name"
                                    type="text"
                                    className={classes.textField}
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.bio}>
                                  <Typography className={classes.label}>
                                    Bio
                                  </Typography>
                                  <TextField
                                    name="bio"
                                    type="text"
                                    className={classes.textField}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    defaultValue={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 1 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link1Title"
                                    className={classes.textField}
                                    defaultValue={link1Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink1Title(e.target.value)
                                    }
                                  />
                                  <Typography className={classes.label}>
                                    Link 1 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link1URL"
                                    placeholder="Ex: https://www.youtube.com/user/Vsauce"
                                    className={classes.textField}
                                    defaultValue={link1URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink1URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 2 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link2Title"
                                    className={classes.textField}
                                    defaultValue={link2Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink2Title(e.target.value)
                                    }
                                  />
                                  <Typography className={classes.label}>
                                    Link 2 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link2Title"
                                    className={classes.textField}
                                    defaultValue={link2URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink2URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 3 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link3Title"
                                    className={classes.textField}
                                    defaultValue={link3Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink3Title(e.target.value)
                                    }
                                  />
                                  <Typography className={classes.label}>
                                    Link 3 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link3Title"
                                    className={classes.textField}
                                    defaultValue={link3URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink3URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                            </Box>
                          </DialogContent>
                        </Dialog>
                        <CardContent style={{ padding: "28px 0 0 10px" }}>
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
                    <Box display="flex" alignItems="center" j>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card1"
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card2"
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card3"
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card4"
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card5"
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card6"
                          personal={true}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box flex={1} justifyContent="center">
                <LinksCard personal={true} />
              </Box>
            </Box>
            <BottomNavbar />
          </React.Fragment>
        )}
      </MediaQuery>

      <MediaQuery minDeviceWidth={1224}>
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
                      <Name name={oldName} />
                      <Username username={oldUsername} />
                      <Biography bio={oldBio} />
                    </Box>
                    <Box
                      flex={1}
                      flexBasis="100%"
                      style={{ textAlign: "center" }}
                    >
                      <ProfilePicture
                        profilePicture={oldProfilePicture}
                        newProfilePicture={profilePicture}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flex={1}
                      flexBasis="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Card className={classes.infoBox}>
                        <CardHeader
                          style={{ padding: "16px 16px 0 0", height: "0px" }}
                          action={
                            <Button
                              className={classes.editProfile}
                              onClick={handleEdit}
                            >
                              Edit Profile
                            </Button>
                          }
                        ></CardHeader>

                        <Dialog
                          open={editing}
                          onClose={handleClose}
                          classes={{ paper: classes.dialogPaper }}
                          PaperProps={{
                            style: {
                              backgroundColor: "#242424",
                              borderRadius: "15px",
                            },
                          }}
                          fullWidth
                        >
                          <DialogTitle className={classes.header}>
                            <Box display="flex">
                              <Typography className={classes.title}>
                                Edit Profile
                              </Typography>
                              <div style={{ flexGrow: "1" }} />
                              <Button
                                className={classes.save}
                                onClick={handleSave}
                              >
                                Save
                              </Button>
                            </Box>
                          </DialogTitle>
                          <DialogContent>
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Box p={3}>
                                <ProfilePicture
                                  profilePicture={oldProfilePicture}
                                  newProfilePicture={profilePicture}
                                  editable={editing}
                                  onChange={handleProfilePictureChange}
                                />
                              </Box>
                              <Box p={3}>
                                <Container className={classes.box}>
                                  <Typography className={classes.label}>
                                    Username
                                  </Typography>
                                  <TextField
                                    name="username"
                                    type="text"
                                    className={classes.textField}
                                    defaultValue={username}
                                    onChange={(e) =>
                                      setUsername(e.target.value)
                                    }
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 30,
                                    }}
                                    helperText={error}
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${username.length}/${30}`}
                                  </Typography>
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.box}>
                                  <Typography className={classes.label}>
                                    Name
                                  </Typography>
                                  <TextField
                                    name="name"
                                    type="text"
                                    className={classes.textField}
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 50,
                                    }}
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${name.length}/${50}`}
                                  </Typography>
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.bio}>
                                  <Typography className={classes.label}>
                                    Bio
                                  </Typography>
                                  <TextField
                                    name="bio"
                                    type="text"
                                    className={classes.textField}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    defaultValue={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 75,
                                    }}
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${bio.length}/${75}`}
                                  </Typography>
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 1 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link1Title"
                                    className={classes.textField}
                                    defaultValue={link1Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 25,
                                    }}
                                    onChange={(e) =>
                                      setLink1Title(e.target.value)
                                    }
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${link1Title.length}/${25}`}
                                  </Typography>
                                  <Typography className={classes.label}>
                                    Link 1 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link1URL"
                                    placeholder="Ex: https://www.youtube.com/user/Vsauce"
                                    className={classes.textField}
                                    defaultValue={link1URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink1URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 2 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link2Title"
                                    className={classes.textField}
                                    defaultValue={link2Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 25,
                                    }}
                                    onChange={(e) =>
                                      setLink2Title(e.target.value)
                                    }
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${link2Title.length}/${25}`}
                                  </Typography>
                                  <Typography className={classes.label}>
                                    Link 2 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link2Title"
                                    className={classes.textField}
                                    defaultValue={link2URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink2URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                              <Box p={3}>
                                <Container className={classes.link}>
                                  <Typography className={classes.label}>
                                    Link 3 Title
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link3Title"
                                    className={classes.textField}
                                    defaultValue={link3Title}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{
                                      className: classes.input,
                                      maxLength: 25,
                                    }}
                                    onChange={(e) =>
                                      setLink3Title(e.target.value)
                                    }
                                  />
                                  <Typography
                                    className={classes.characterLimit}
                                  >
                                    {`${link3Title.length}/${25}`}
                                  </Typography>
                                  <Typography className={classes.label}>
                                    Link 3 URL
                                  </Typography>
                                  <TextField
                                    type="text"
                                    name="link3Title"
                                    className={classes.textField}
                                    defaultValue={link3URL}
                                    fullWidth
                                    InputProps={{ disableUnderline: true }}
                                    inputProps={{ className: classes.input }}
                                    onChange={(e) =>
                                      setLink3URL(e.target.value)
                                    }
                                  />
                                </Container>
                              </Box>
                            </Box>
                          </DialogContent>
                        </Dialog>
                        <CardContent style={{ padding: "28px 0 0 10px" }}>
                          <Typography className={classes.text}>
                            <Followers
                              followers={followers}
                              followerCount={followerCount}
                              currentUser={true}
                            />
                            <br />
                            <Following
                              following={followings}
                              followingCount={followingCount}
                              currentUser={true}
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
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card2"
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card3"
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card4"
                          personal={true}
                        />
                      </Box>
                    </Box>
                    <Box display="flex">
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card5"
                          personal={true}
                        />
                      </Box>
                      <Box p={2}>
                        <ProfileCard
                          username={username}
                          cardNumber="card6"
                          personal={true}
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
          </React.Fragment>
        )}
      </MediaQuery>
    </div>
  );
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalProfilePage);
