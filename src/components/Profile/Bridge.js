import React, { useEffect, useState } from "react";

import "./profile.css";
import Navbar from "../Navbar";
import LeftNavbar from "../LeftNavbar";
import BottomNavbar from "../BottomNavbar";

import BackButton from "../BackButton";
import UsernameButton from "../UsernameButton";
import ProfilePicture from "./ProfilePicture";
import NotesCard from "./NotesCard";
import BridgeCard from "./BridgeCard";
import EditCard from "./EditCard";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import MediaQuery from "react-responsive";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

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
    margin: "0 auto",
  },
  mobileroot: {
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
    fontSize: "12px",
    backgroundColor: "grey",
    color: "#FFFFFF",
    borderRadius: "50px",
    // width: "5%",
    // height: "10%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // marginRight: "75%",
    // marginTop: "-5%",
  },
  container: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
  },
  row: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  card: {
    "&:after": {
      content: "''",
      paddingTop: "100%",
      display: "block",
      width: 0,
      height: 0,
    },
    display: "flex",
    flex: 1,
    maxWidth: "200px",
    minWidth: "60px",
    minHeight: "60px",
    maxHeight: "200px",
  },
});

function Bridge(props) {
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(null);
  const [notes, setNotes] = useState("");
  const [editing, setEditing] = useState(false);
  const [oldCardTitle, setOldCardTitle] = useState(null);
  const [cardTitle, setCardTitle] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personal, setPersonal] = useState(false);

  const classes = useStyles();

  const onNotesChange = (value) => {
    setNotes(value);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDone = () => {
    props.firebase.editNotes(cardNumber, notes);
    setEditing(false);
  };

  useEffect(() => {
    const username = props.match.params.username.toString().toLowerCase();
    const cardTitle = props.match.params.cardTitle;

    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        props.firebase.currentUser().on("value", (snapshot) => {
          if (snapshot.val().username.toLowerCase() === username) {
            setPersonal(true);
          } else {
            setPersonal(false);
          }
        });
      } else {
        setPersonal(false);
      }
      let modifiedCardTitle = cardTitle.replace(/_/g, " ");
      modifiedCardTitle =
        modifiedCardTitle[0].toUpperCase() + modifiedCardTitle.slice(1);
      if (cardTitle) setOldCardTitle(modifiedCardTitle);
      setCardTitle(modifiedCardTitle);
      if (cardTitle !== null) {
        props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
          const userIDState = snapshot.val();
          if (userIDState) {
            props.firebase
              .getCardNumberWithCardTitle(
                userIDState,
                cardTitle[0].toUpperCase() + cardTitle.slice(1)
              )
              .on("value", (snapshot) => {
                const cn = snapshot.val();
                if (cn) {
                  setCardNumber(cn);
                  props.firebase.user(userIDState).on("value", (snapshot) => {
                    const state = snapshot.val();
                    if (state) {
                      setUserID(userIDState);
                      setName(state.name);
                      setUsername(state.username);
                      setProfilePicture(state.profilePicture);
                      setLoading(false);
                    }
                    if (state[cn].notes) {
                      setNotes(state[cn].notes);
                    }
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
      } else {
        setLoading(false);
      }
    });
  }, [props.firebase]);

  return (
    <div className="bg">
      {!loading && (
        <React.Fragment>
          <MediaQuery maxWidth={1114}>
            <Navbar />
            <Container display="flex" style={{ margin: "80px 0" }}>
              <Box
                display="flex"
                flexDirection="row"
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
                  <Card
                    style={{
                      fontFamily: ["Montserrat", "sans-serif"],
                      backgroundColor: "black",
                      color: "#FFFFFF",
                      fontSize: "17px",
                      fontWeight: 800,
                      borderRadius: "100px",
                      alignSelf: "flex-start",
                      width: "fit-content",
                      padding: "10px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      marginBottom: "10%",
                    }}
                  >
                    {!editing && <span>{cardTitle}</span>}
                    {editing && (
                      <EditCard
                        className={classes.test}
                        display="none"
                        username={username}
                        oldCardTitle={oldCardTitle}
                        cardTitle={cardTitle}
                        cardNumber={cardNumber}
                        bridge={true}
                        editable={true}
                        size="small"
                      />
                    )}
                  </Card>
                  <Box>
                    {personal && (
                      <React.Fragment>
                        {!editing && (
                          <Button
                            className={classes.root}
                            style={{ margin: 0 }}
                            onClick={handleEdit}
                          >
                            Edit
                          </Button>
                        )}
                        {editing && (
                          <Button
                            className={classes.root}
                            style={{ margin: 0 }}
                            onClick={handleDone}
                          >
                            Done
                          </Button>
                        )}
                      </React.Fragment>
                    )}
                  </Box>
                </Box>
                <Box style={{ textAlign: "right" }}>
                  <UsernameButton
                    display="block"
                    name={name}
                    username={username}
                    size="small"
                  />
                  <Box marginLeft="50%" style={{ textAlign: "right" }}>
                    <ProfilePicture
                      display="block"
                      size="small"
                      profilePicture={profilePicture}
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                display="flex"
                flex={1}
                height="200px"
                justifyContent="center"
                style={{ margin: "50px 0" }}
              >
                <NotesCard
                  width="small"
                  notes={notes}
                  cardNumber={cardNumber}
                  editable={editing}
                  personal={personal}
                  onChange={onNotesChange}
                />
              </Box>
              <Container style={{ padding: "0 5px 0 5px" }}>
                <Box className={classes.row}>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard1"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard2"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard3"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                </Box>
                <Box className={classes.row}>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard4"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard5"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard6"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                </Box>
                <Box className={classes.row}>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard7"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard8"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                  <Box m={1} className={classes.card}>
                    <BridgeCard
                      size="small"
                      userID={userID}
                      name={name}
                      username={username}
                      profilePicture={profilePicture}
                      cardNumber={cardNumber}
                      bridgeCardNumber="bridgeCard9"
                      editable={editing}
                      personal={personal}
                    />
                  </Box>
                </Box>
              </Container>
            </Container>
            <BottomNavbar />
          </MediaQuery>
          <MediaQuery minWidth={1115}>
            <Navbar />
            <Box display="flex" className={classes.container}>
              <LeftNavbar />
              <Box flex={1} justifyContent="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  style={{ width: "700px" }}
                >
                  <Grid
                    container
                    style={{ minHeight: "120px", maxHeight: "200px" }}
                  >
                    <Grid container item xs={12} sm={4}>
                      <BackButton username={username} />
                    </Grid>
                    <Grid container item xs={12} sm={4}>
                      <Card
                        style={{
                          fontFamily: ["Montserrat", "sans-serif"],
                          backgroundColor: "black",
                          color: "#FFFFFF",
                          fontSize: "30px",
                          fontWeight: 800,
                          borderRadius: "15px",
                          alignSelf: "center",
                          width: "100%",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        {!editing && <span>{cardTitle}</span>}
                        {editing && (
                          <EditCard
                            display="none"
                            name={name}
                            username={username}
                            oldCardTitle={oldCardTitle}
                            cardTitle={cardTitle}
                            cardNumber={cardNumber}
                            bridge={true}
                            editable={true}
                          />
                        )}
                      </Card>
                    </Grid>
                    <Grid container item xs={12} sm={4}>
                      {personal && (
                        <React.Fragment>
                          {!editing && (
                            <Button
                              className={classes.root}
                              onClick={handleEdit}
                            >
                              Edit
                            </Button>
                          )}
                          {editing && (
                            <Button
                              className={classes.root}
                              onClick={handleDone}
                            >
                              Done
                            </Button>
                          )}
                        </React.Fragment>
                      )}
                    </Grid>
                  </Grid>

                  <Container style={{ padding: "0 5px 0 5px" }}>
                    <Box className={classes.row}>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard1"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard2"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard3"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                    </Box>
                    <Box className={classes.row}>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard4"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard5"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard6"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                    </Box>
                    <Box className={classes.row}>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard7"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard8"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                      <Box m={1} className={classes.card}>
                        <BridgeCard
                          userID={userID}
                          name={name}
                          username={username}
                          profilePicture={profilePicture}
                          cardNumber={cardNumber}
                          bridgeCardNumber="bridgeCard9"
                          editable={editing}
                          personal={personal}
                        />
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </Box>
              <Box flex={1} justifyContent="center" pl={3}>
                <Box style={{ textAlign: "center" }}>
                  {" "}
                  <UsernameButton
                    display="block"
                    name={name}
                    username={username}
                  />
                  <ProfilePicture profilePicture={profilePicture} />
                </Box>
                <Box style={{ marginTop: "10px" }}>
                  <NotesCard
                    height={630}
                    notes={notes}
                    cardNumber={cardNumber}
                    editable={editing}
                    personal={personal}
                    onChange={onNotesChange}
                  />
                </Box>
              </Box>
            </Box>
          </MediaQuery>
        </React.Fragment>
      )}
    </div>
  );
}
const condition = (authenticated) => !!authenticated;

export default withRouter(withFirebase(Bridge));
