import React, { useEffect, useState } from "react";

import NotFound from "../NotFound";
import "./profile.css";
import Navbar from "../Navbar";
import LeftNavbar from "../LeftNavbar";
import BottomNavbar from "../BottomNavbar";
import DefaultProfilePicture from "../../images/default-profile-pic.png";

import BackButton from "../BackButton";
import UsernameButton from "../UsernameButton";
import ProfilePicture from "./ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "./BridgeCard";
import Button from "@material-ui/core/Button";
import MediaQuery from "react-responsive";
import Box from "@material-ui/core/Box";

import EditCard from "./EditCard";
import Card from "@material-ui/core/Card";

import Name from "./Name";
import Username from "./Username";

import * as ROUTES from "../../constants/routes";

import { makeStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";
import NotesCard from "./NotesCard";
import { Container } from "@material-ui/core";

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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      const modifiedCardTitle = cardTitle.replace(/_/g, " ");
      if (cardTitle) setOldCardTitle(modifiedCardTitle);
      setCardTitle(modifiedCardTitle);
      if (cardTitle !== null) {
        props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
          console.log("aah");
          const userIDState = snapshot.val();
          if (userIDState) {
            props.firebase
              .getCardNumberWithCardTitle(userIDState, cardTitle)
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
            <Container
              display="flex"
              flexDirection="column"
              style={{ margin: "80px 0" }}
            >
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
                      width: "40%",
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
                        fontSize="small"
                        className={classes.test}
                        display="none"
                        username={username}
                        oldCardTitle={oldCardTitle}
                        cardTitle={cardTitle}
                        cardNumber={cardNumber}
                        bridge={true}
                        editable={true}
                      />
                    )}
                  </Card>
                  <Box marginTop="-8%" marginLeft="5%">
                    {personal && (
                      <React.Fragment>
                        {!editing && (
                          <Button className={classes.root} onClick={handleEdit}>
                            Edit
                          </Button>
                        )}
                        {editing && (
                          <Button className={classes.root} onClick={handleDone}>
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
                height="160px"
                justifyContent="center"
                style={{ margin: "50px 0" }}
              >
                <NotesCard
                  notes={notes}
                  cardNumber={cardNumber}
                  editable={editing}
                  personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
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
                      personal={true}
                    />
                  </Box>
                </Box>
              </Container>
            </Container>
            <BottomNavbar />
          </MediaQuery>
          <MediaQuery minWidth={1115} maxWidth={1399}>
            <Navbar />
            <Box display="flex" className={classes.container}>
              <Box justifyContent="center">
                <LeftNavbar noText={true} />
              </Box>
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
                        />
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </Box>
              <Box flex={1} justifyContent="center" pl={3}>
                <Box
                  display="flex"
                  flexDirection="column"
                  style={{ marginTop: "10px", width: "280px" }}
                >
                  <Box style={{ textAlign: "center" }}>
                    {" "}
                    <UsernameButton display="block" username={username} />
                    <ProfilePicture profilePicture={profilePicture} />
                  </Box>
                  <Box style={{ marginTop: "10px" }}>
                    <NotesCard
                      height={630}
                      notes={notes}
                      cardNumber={cardNumber}
                      editable={editing}
                      personal={true}
                      onChange={onNotesChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </MediaQuery>
          <MediaQuery minWidth={1400}>
            <Navbar />
            <Box display="flex" className={classes.container}>
              <Box flex={1} justifyContent="center">
                <LeftNavbar />
              </Box>
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
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
                          personal={true}
                        />
                      </Box>
                    </Box>
                  </Container>
                </Box>
              </Box>
              <Box flex={1} justifyContent="center" pl={3}>
                <Box style={{ textAlign: "center" }}>
                  {" "}
                  <UsernameButton display="block" username={username} />
                  <ProfilePicture profilePicture={profilePicture} />
                </Box>
                <Box style={{ marginTop: "10px" }}>
                  <NotesCard
                    height={630}
                    notes={notes}
                    cardNumber={cardNumber}
                    editable={editing}
                    personal={true}
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
