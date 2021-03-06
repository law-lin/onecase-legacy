import React, { useState, useEffect } from "react";

import EditBridgeCard from "./EditBridgeCard";
// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Link, useParams, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

const useStyles = makeStyles({
  root: {
    color: "#3B3C3B",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
    boxShadow: "none",
  },
  button: {
    "&:hover": {
      backgroundColor: "#3E4E55",
      color: "#000000",
      textDecoration: "none",
    },
    "&:active": {
      color: "#3E4E55",
    },
    color: "#3B3C3B",
    width: (props) => (props.size === "200px" ? "200px" : "100%"),
    height: (props) => (props.size === "200px" ? "200px" : "100%"),
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    opacity: 1,
    fontFamily: ["Montserrat", "sans-serif"],
    textAlign: "center",
    fontSize: (props) =>
      props.size === "small"
        ? "15px"
        : props.size === "medium"
        ? "20px"
        : "30px",
    boxShadow: "none",
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

function BridgeCard(props) {
  const [cardID, setCardID] = useState(null);
  const [bridgeCardTitle, setBridgeCardTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [cardImageURL, setCardImageURL] = useState(null);
  const [cardCoverImageURL, setCardCoverImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeCreated, setTimeCreated] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const classes = useStyles(props);
  const { cardTitle } = useParams();

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
    setLoading(true);
    if (props.cardID) {
      props.firebase.bridgeCards(props.cardID).on("value", (snapshot) => {
        const state = snapshot.val();
        if (state) {
          setCardID(snapshot.key);
          setBridgeCardTitle(state.bridgeCardTitle);
          setCaption(state.caption);
          setDescription(state.description);
          setLink(state.link);
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
          setCardID(null);
          setBridgeCardTitle("");
          setCaption("");
          setDescription("");
          setLink("");
          setCardCoverImageURL(null);
          setCardImageURL(null);
          setLoading(false);
        }
      });
    } else {
      props.firebase
        .bridgeCardIDs(props.userID, props.cardNumber, props.bridgeCardNumber)
        .on("value", (snapshot) => {
          const cardID = snapshot.val();
          props.firebase.bridgeCards(cardID).on("value", (snapshot) => {
            const state = snapshot.val();
            if (state) {
              setCardID(snapshot.key);
              setBridgeCardTitle(state.bridgeCardTitle);
              setCaption(state.caption);
              setDescription(state.description);
              setLink(state.link);
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
              setCardID(null);
              setBridgeCardTitle(null);
              setCaption(null);
              setDescription(null);
              setLink(null);
              setCardCoverImageURL(null);
              setCardImageURL(null);
              setLoading(false);
            }
          });
        });
    }
  }, [
    props.firebase,
    props.bridgeCardNumber,
    props.cardID,
    props.cardNumber,
    props.userID,
    monthNames,
  ]);

  // handleClick = () => {
  //   let cardTitlePath = state.parentCardTitle;
  //   let bridgeCardTitlePath = state.cardTitle
  //     .toLowerCase()
  //     .split(" ")
  //     .join("_");
  //   props.history.push(`${cardTitlePath}/${bridgeCardTitlePath}`);
  // };

  return (
    <React.Fragment>
      {!props.editable && bridgeCardTitle && (
        <React.Fragment>
          <Link
            className={classes.button}
            style={{
              background: cardCoverImageURL
                ? `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${cardCoverImageURL}) 0 0/100% 100% no-repeat`
                : "#FFFFFF 0 0/100% 100% no-repeat",
            }}
            to={{
              pathname: `/c/${cardID}`,
              state: { modal: true },
            }}
          >
            {loading && <div>Loading...</div>}
            <Typography className={classes.cardTitle}>
              {bridgeCardTitle}
            </Typography>
          </Link>
        </React.Fragment>
      )}
      {!props.editable && !bridgeCardTitle && props.personal && (
        <EditBridgeCard
          display="none"
          userID={props.userID}
          name={props.name}
          username={props.username}
          profilePicture={props.profilePicture}
          cardID={cardID}
          bridgeCardTitle={bridgeCardTitle}
          category={cardTitle}
          caption={caption}
          description={description}
          link={link}
          cardImageURL={cardImageURL}
          cardCoverImageURL={cardCoverImageURL}
          cardNumber={props.cardNumber}
          bridgeCardNumber={props.bridgeCardNumber}
          editable={true}
          size={props.size}
        />
      )}
      {!props.editable && !bridgeCardTitle && !props.personal && (
        <Card className={classes.root}></Card>
      )}
      {props.editable && (
        <Card
          className={classes.root}
          style={{
            background: cardCoverImageURL
              ? `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${cardCoverImageURL}) 0 0/100% 100% no-repeat`
              : "#FFFFFF 0 0/100% 100% no-repeat",
          }}
        >
          <CardHeader
            style={{ padding: "16px 16px 0 0", height: "0px" }}
            action={
              <EditBridgeCard
                userID={props.userID}
                name={props.name}
                username={props.username}
                profilePicture={props.profilePicture}
                cardID={cardID}
                bridgeCardTitle={bridgeCardTitle}
                category={cardTitle}
                caption={caption}
                description={description}
                link={link}
                cardCoverImageURL={cardCoverImageURL}
                cardImageURL={cardImageURL}
                cardNumber={props.cardNumber}
                bridgeCardNumber={props.bridgeCardNumber}
                editable={props.editable}
                size={props.size}
              />
            }
          />
          <CardContent>
            {loading && <div>Loading...</div>}
            <Typography className={classes.cardTitle}>
              {bridgeCardTitle}
            </Typography>
          </CardContent>
        </Card>
      )}
    </React.Fragment>
  );
}
const CardLink = compose(withRouter, withFirebase)(BridgeCard);

export default CardLink;
