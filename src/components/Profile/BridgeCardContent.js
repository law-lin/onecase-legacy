import React, { useEffect, useState } from "react";

import { IoMdClose } from "react-icons/io";

import Navbar from "../Navbar";
import LeftNavbar from "../LeftNavbar";
import BottomNavbar from "../BottomNavbar";

import MediaQuery from "react-responsive";

import Avatar from "@material-ui/core/Avatar";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";

import { useParams, useLocation } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Mixpanel } from "../Mixpanel";

const useStyles = makeStyles({
  root: {
    margin: "70px auto 55px auto",
    display: "flex",
    padding: 0,
    justifyContent: "center",
  },
  container: {
    display: "flex",
    minWidth: "650px",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
  },
  button: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#3E4E55",
    },
    "&:focus": {
      outline: "none",
    },
    color: "#3B3C3B",
    height: "200px",
    width: "200px",
    boxShadow: "none",
  },
  cardTitle: {
    opacity: 1,
    fontFamily: ["Montserrat", "sans-serif"],
    textAlign: "center",
    fontSize: "30px",
    fontWeight: 700,
    overflowWrap: "break-word",
  },
  title: {
    backgroundColor: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
    fontSize: "25px",
    marginTop: "8px",
    padding: "0 28px",
    borderRadius: "8px",
    textAlign: "center",
    display: "inline",
  },
  dialog: {
    color: "#FFFFFF",
    backgroundColor: "#232323",
  },
  caption: {
    padding: "0 0 25px 0",
    textAlign: "center",
    marginLeft: "3px",
    minHeight: "20px",
    width: "100%",
    fontFamily: ["Montserrat", "sans-serif"],
    color: "#FFFFFF",
    fontSize: "25px",
    fontWeight: 700,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      height: "3px",
      bottom: 0,
      left: 0,
    },
  },
  description: {
    marginTop: "15px",
    paddingLeft: "25px",
    paddingRight: "25px",
    minHeight: "200px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    color: "#FFFFFF",
    fontSize: "18px",
  },
  name: {
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
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 800,
    fontSize: "24px",
    color: "#FFFFFF",
  },
  username: {
    color: "#FFFFFF",
    fontSize: "18px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 600,
  },
  lastEdited: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 600,
    textAlign: "right",
    padding: "30px 10px 5px 0px",
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
function BridgeCardContent(props) {
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [bridgeCardNumber, setBridgeCardNumber] = useState(null);
  const [bridgeCardTitle, setBridgeCardTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [cardImageURL, setCardImageURL] = useState(null);
  const [cardCoverImageURL, setCardCoverImageURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [timeCreated, setTimeCreated] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const classes = useStyles();
  const { cardID } = useParams();

  let location = useLocation();
  let modal = props.isModal;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    props.firebase.bridgeCards(cardID).on("value", (snapshot) => {
      const state = snapshot.val();
      if (state) {
        props.firebase.auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            props.firebase.currentUser().once("value", (snapshot) => {
              if (snapshot.val()) {
                if (snapshot.val().username !== state.username) {
                  Mixpanel.track("Card Click", {
                    Category: state.category,
                    "Card ID": snapshot.key,
                  });
                } else {
                  Mixpanel.track("Card Click (user's own cards)", {
                    Category: state.category,
                    "Card ID": snapshot.key,
                  });
                }
              }
            });
          }
        });
        setName(state.name);
        setUsername(state.username);
        setProfilePicture(state.profilePicture);
        setBridgeCardTitle(state.bridgeCardTitle);
        setCaption(state.caption);
        setDescription(state.description);
        setCardCoverImageURL(state.cardCoverImageURL);
        setCardImageURL(state.cardImageURL);
        if (state.link) {
          if (!~link.indexOf("http")) {
            setLink("http://" + state.link);
          }
        }
        if (state.timeCreated) {
          const date = new Date(state.timeCreated);
          const dateCreated =
            monthNames[date.getMonth()] +
            " " +
            date.getDate() +
            ", " +
            date.getFullYear();
          setTimeCreated(dateCreated);
        }
        if (state.lastUpdated) {
          const date = new Date(state.lastUpdated);
          const dateUpdated =
            monthNames[date.getMonth()] +
            " " +
            date.getDate() +
            ", " +
            date.getFullYear();
          setLastUpdated(dateUpdated);
        }
        setLoading(false);
      } else {
        setName(null);
        setUsername(null);
        setProfilePicture(null);
        setBridgeCardTitle(null);
        setCaption(null);
        setDescription(null);
        setLink(null);
        setCardCoverImageURL(null);
        setCardImageURL(null);
        setLoading(false);
      }
    });
  }, []);
  return (
    <React.Fragment>
      {!loading && (
        <React.Fragment>
          {modal && (
            <Dialog
              fullWidth={true}
              open={modal}
              onClose={() => window.history.back()}
              PaperProps={{
                style: {
                  backgroundColor: "#232323",
                  minHeight: "450px",
                  minWidth: "800px",
                },
              }}
            >
              <Box
                display="flex"
                style={{ flex: "0 0 auto", margin: 0, padding: "16px 24px" }}
              >
                <Box flex={1}>
                  <Typography className={classes.title}>
                    {bridgeCardTitle}
                  </Typography>
                </Box>
                <Box flex={1}></Box>
                <Box display="flex" justifyContent="flex-end" flex={1}>
                  <div>
                    <Link href={"/" + username} className={classes.name}>
                      {name}
                    </Link>
                    <Typography className={classes.username}>
                      @{username}
                    </Typography>
                  </div>
                  <Link href={"/" + username}>
                    <Avatar
                      style={{
                        margin: "0 0 0 15px",
                        height: "50px",
                        width: "50px",
                      }}
                      src={profilePicture}
                    />
                  </Link>
                </Box>
              </Box>
              <DialogContent>
                <Box display="flex">
                  <Box>
                    <React.Fragment>
                      {cardImageURL && (
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            minHeight: "350px",
                            width: "100%",
                          }}
                        >
                          <img
                            src={cardImageURL}
                            style={{ width: "350px", height: "350px" }}
                            alt="Show off your project!"
                          />
                        </Grid>
                      )}
                      {!cardImageURL && (
                        <p
                          style={{
                            color: "#FFFFFF",
                            fontFamily: ["Mukta Mahee", "sans-serif"],
                          }}
                        >
                          No image to display
                        </p>
                      )}
                    </React.Fragment>
                  </Box>
                  <Box display="flex" flexDirection="column" flex={1}>
                    <Typography className={classes.caption}>
                      {caption}
                    </Typography>
                    <Typography gutterBottom className={classes.description}>
                      {description}
                    </Typography>
                    <Box style={{ padding: "0 20px", minHeight: "24px" }}>
                      <Link href={link}>{link}</Link>
                    </Box>
                    <Typography className={classes.lastEdited}>
                      {timeCreated}
                      {lastUpdated && (
                        <React.Fragment>
                          <br />
                          <span>Last Edited: {lastUpdated}</span>
                        </React.Fragment>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <IconButton
                  onClick={() => window.history.back()}
                  className={classes.close}
                >
                  <IoMdClose />
                </IconButton>
              </DialogActions>
            </Dialog>
          )}
          {!modal && (
            <React.Fragment>
              <MediaQuery maxWidth={1114}>
                <div style={{ backgroundColor: "#232323" }}>
                  <Navbar />
                  <Container className={classes.root}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      style={{ width: "100%" }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        flex={1}
                        style={{ margin: "15px 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <Typography className={classes.title}>
                            {bridgeCardTitle}
                          </Typography>
                        </Box>
                        <Box>
                          <div>
                            <Link
                              href={"/" + username}
                              className={classes.name}
                            >
                              {name}
                            </Link>
                            <Typography className={classes.username}>
                              @{username}
                            </Typography>
                          </div>
                          <Link href={"/" + username}>
                            <Avatar
                              style={{
                                margin: "0 0 0 15px",
                                height: "50px",
                                width: "50px",
                              }}
                              src={profilePicture}
                            />
                          </Link>
                        </Box>
                      </Box>
                      <Box flex={1}>
                        <Box>
                          <React.Fragment>
                            {cardImageURL && (
                              <Grid
                                container
                                justify="center"
                                alignItems="center"
                                style={{
                                  minHeight: "350px",
                                  width: "100%",
                                }}
                              >
                                <img
                                  src={cardImageURL}
                                  style={{
                                    width: "350px",
                                    height: "350px",
                                  }}
                                  alt="Show off your project!"
                                />
                              </Grid>
                            )}
                            {!cardImageURL && (
                              <p
                                style={{
                                  color: "#FFFFFF",
                                  fontFamily: ["Mukta Mahee", "sans-serif"],
                                }}
                              >
                                No image to display
                              </p>
                            )}
                          </React.Fragment>
                        </Box>
                        <Box display="flex" flexDirection="column" flex={1}>
                          <Typography
                            className={classes.caption}
                            style={{ padding: "10px 0" }}
                          >
                            {caption}
                          </Typography>
                          <Typography
                            gutterBottom
                            className={classes.description}
                          >
                            {description}
                          </Typography>
                        </Box>
                        <Box style={{ padding: "0 20px", minHeight: "24px" }}>
                          <Link href={link}>{link}</Link>
                        </Box>
                        <Typography className={classes.lastEdited}>
                          {timeCreated}
                          {lastUpdated && (
                            <React.Fragment>
                              <br />
                              <span>Last Edited: {lastUpdated}</span>
                            </React.Fragment>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Container>
                  <BottomNavbar />
                </div>
              </MediaQuery>
              <MediaQuery minWidth={1115}>
                <Navbar />
                <Container className={classes.root}>
                  <Box flex={1}>
                    <LeftNavbar />
                  </Box>
                  <Box flex={1}>
                    <Container className={classes.container}>
                      <Card
                        style={{
                          backgroundColor: "#232323",
                          minHeight: "450px",
                          minWidth: "800px",
                        }}
                      >
                        <Box
                          display="flex"
                          style={{
                            flex: "0 0 auto",
                            margin: 0,
                            padding: "16px 24px",
                          }}
                        >
                          <Box flex={1}>
                            <Typography className={classes.title}>
                              {bridgeCardTitle}
                            </Typography>
                          </Box>
                          <Box flex={1}></Box>
                          <Box
                            display="flex"
                            justifyContent="flex-end"
                            flex={1}
                          >
                            <div>
                              <Link
                                href={"/" + username}
                                className={classes.name}
                              >
                                {name}
                              </Link>
                              <Typography className={classes.username}>
                                @{username}
                              </Typography>
                            </div>
                            <Link href={"/" + username}>
                              <Avatar
                                style={{
                                  margin: "0 0 0 15px",
                                  height: "50px",
                                  width: "50px",
                                }}
                                src={profilePicture}
                              />
                            </Link>
                          </Box>
                        </Box>
                        <DialogContent>
                          <Box display="flex">
                            <Box>
                              <React.Fragment>
                                {cardImageURL && (
                                  <Grid
                                    container
                                    justify="center"
                                    alignItems="center"
                                    style={{
                                      minHeight: "350px",
                                      width: "100%",
                                    }}
                                  >
                                    <img
                                      src={cardImageURL}
                                      style={{
                                        width: "350px",
                                        height: "350px",
                                      }}
                                      alt="Show off your project!"
                                    />
                                  </Grid>
                                )}
                                {!cardImageURL && (
                                  <p
                                    style={{
                                      color: "#FFFFFF",
                                      fontFamily: ["Mukta Mahee", "sans-serif"],
                                    }}
                                  >
                                    No image to display
                                  </p>
                                )}
                              </React.Fragment>
                            </Box>
                            <Box display="flex" flexDirection="column" flex={1}>
                              <Typography className={classes.caption}>
                                {caption}
                              </Typography>
                              <Typography
                                gutterBottom
                                className={classes.description}
                              >
                                {description}
                              </Typography>
                              <Box
                                style={{ padding: "0 20px", minHeight: "24px" }}
                              >
                                <Link href={link}>{link}</Link>
                              </Box>
                              <Typography className={classes.lastEdited}>
                                {timeCreated}
                                {lastUpdated && (
                                  <React.Fragment>
                                    <br />
                                    <span>Last Edited: {lastUpdated}</span>
                                  </React.Fragment>
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </DialogContent>
                      </Card>
                    </Container>
                  </Box>
                  <Box flex={1}></Box>
                </Container>
              </MediaQuery>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default withFirebase(BridgeCardContent);
