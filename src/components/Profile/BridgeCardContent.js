import React, { useEffect, useState } from "react";

import Navbar from "../Navbar";
import LeftNavbar from "../LeftNavbar";
import BottomNavbar from "../BottomNavbar";
import MediaQuery from "react-responsive";

import Avatar from "react-avatar";
import Link from "@material-ui/core/Link";
import CategoriesCard from "../CategoriesCard";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Box from "@material-ui/core/Box";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useParams, useLocation } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1250px",
    maxWidth: "1250px",
    display: "flex",
    padding: 0,
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
    width: "350px",
    display: "inline",
  },
  dialog: {
    color: "#FFFFFF",
    backgroundColor: "#232323",
  },
  caption: {
    padding: "50px 0 25px 0",
    textAlign: "center",
    marginLeft: "3px",
    minHeight: "20px",
    width: "420px",
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
    paddingRight: "5px",
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
        setName(state.name);
        setUsername(state.username);
        setProfilePicture(state.profilePicture);
        setBridgeCardTitle(state.bridgeCardTitle);
        setCaption(state.caption);
        setDescription(state.description);
        setCardCoverImageURL(state.cardCoverImageURL);
        setCardImageURL(state.cardImageURL);
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
                      style={{ margin: "0 0 0 15px" }}
                      size="50"
                      round="50px"
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
                  <Box>
                    <Typography className={classes.caption}>
                      {caption}
                    </Typography>
                    <Typography gutterBottom className={classes.description}>
                      {description}
                    </Typography>

                    <Typography className={classes.lastEdited}>
                      {timeCreated}
                    </Typography>

                    {lastUpdated && (
                      <Typography className={classes.lastEdited}>
                        Last Edited: {lastUpdated}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </DialogContent>
            </Dialog>
          )}
          {!modal && (
            <MediaQuery minWidth={1400}>
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
                        <Box display="flex" justifyContent="flex-end" flex={1}>
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
                              style={{ margin: "0 0 0 15px" }}
                              size="50"
                              round="50px"
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
                          <Box>
                            <Typography className={classes.caption}>
                              {caption}
                            </Typography>
                            <Typography
                              gutterBottom
                              className={classes.description}
                            >
                              {description}
                            </Typography>

                            <Typography className={classes.lastEdited}>
                              {timeCreated}
                            </Typography>

                            {lastUpdated && (
                              <Typography className={classes.lastEdited}>
                                Last Edited: {lastUpdated}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </DialogContent>
                    </Card>
                  </Container>
                </Box>
                <Box flex={1}>
                  <Container>
                    <CategoriesCard />
                  </Container>
                </Box>
              </Container>
            </MediaQuery>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default withFirebase(BridgeCardContent);
