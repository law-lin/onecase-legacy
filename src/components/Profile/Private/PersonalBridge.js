import React, { useEffect, useState } from "react";

import "../profile.css";
import Navbar from "../../Navbar";
import LeftNavbar from "../../LeftNavbar";
import BottomNavbar from "../../BottomNavbar";
import DefaultProfilePicture from "../../../images/default-profile-pic.png";

import BackButton from "../../BackButton";
import UsernameButton from "../../UsernameButton";
import ProfilePicture from "../ProfilePicture";
import Grid from "@material-ui/core/Grid";
import BridgeCard from "../BridgeCard";
import Button from "@material-ui/core/Button";
import MediaQuery from "react-responsive";
import Box from "@material-ui/core/Box";

import EditCard from "../EditCard";
import Card from "@material-ui/core/Card";

import Name from "../Name";
import Username from "../Username";
import { makeStyles } from "@material-ui/core/styles";

import { withAuthorization } from "../../Session";
import NotesCard from "../NotesCard";
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
  test: {
    fontSize: "12px",
  },
});

function PersonalBridge(props) {
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

    const modifiedCardTitle = cardTitle.replace(/_/g, " ");
    if (cardTitle) setOldCardTitle(modifiedCardTitle);
    setCardTitle(modifiedCardTitle);

    props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const uid = snapshot.val();
      if (uid) {
        setUserID(uid);
        props.firebase
          .getCardNumberWithCardTitle(uid, cardTitle)
          .on("value", (snapshot) => {
            const cn = snapshot.val();
            if (cn) {
              setCardNumber(cn);
              props.firebase.user(uid).on("value", (snapshot) => {
                const state = snapshot.val();
                if (state) {
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
            }
          });
      }
    });
  }, [props.firebase]);

  return (
    <div className="bg">
      {!loading && (
        <MediaQuery minDeviceWidth={1}>
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
                  </Grid>
                </Grid>

                <Box>
                  <Box display="flex" flexDirection="row">
                    <Box m={2}>
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
                    <Box m={2}>
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
                    <Box m={2}>
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
                  <Box display="flex" flexDirection="row">
                    <Box m={2}>
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
                    <Box m={2}>
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
                    <Box m={2}>
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
                  <Box display="flex" flexDirection="row">
                    <Box m={2}>
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
                    <Box m={2}>
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
                    <Box m={2}>
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
                </Box>
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
                <Box>
                  <NotesCard
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
      )}
    </div>
  );
}
const condition = (authenticated) => !!authenticated;

export default withAuthorization(condition)(PersonalBridge);
