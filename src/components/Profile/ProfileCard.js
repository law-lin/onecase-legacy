import React, { useEffect, useState } from "react";

import { withFirebase } from "../Firebase";

import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import EditCard from "./EditCard";

const useStyles = makeStyles({
  root: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: (props) => (props.size === "small" ? "90px" : "110px"),
    minWidth: (props) => (props.size === "small" ? "160px" : "180px"),
    maxWidth: (props) => (props.size === "small" ? "175px" : "230px"),
    borderRadius: "20px",
    margin: "10px 10px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    "&:hover": {
      outline: "none",
      color: "#FFFFFF",
      backgroundColor: "#3E4E55",
      textDecoration: "none",
    },
    "&:focus": {
      outline: "none",
    },
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: (props) => (props.size === "small" ? "90px" : "110px"),
    minWidth: (props) => (props.size === "small" ? "160px" : "180px"),
    maxWidth: (props) => (props.size === "small" ? "175px" : "230px"),
    borderRadius: "20px",
    margin: "10px 10px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: (props) => (props.size === "small" ? "20px" : "25px"),
    fontWeight: 800,
    textAlign: "center",
    overflowWrap: "break-word",
  },
  box: {
    justifyContent: "center",
    "@media (max-width: 250px)": {
      flexBasis: "51%",
    },
    flexBasis: "34%",
  },
});

function ProfileCard(props) {
  const [cardTitle, setCardTitle] = useState(null);
  const [oldCardTitle, setOldCardTitle] = useState("placeholder");
  const [loading, setLoading] = useState(false);

  const classes = useStyles(props);

  useEffect(() => {
    setLoading(true);
    const username = props.match.params.username.toString().toLowerCase();

    props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const userIDState = snapshot.val();
      if (userIDState) {
        props.firebase
          .cards(userIDState, props.cardNumber)
          .on("value", (snapshot) => {
            const state = snapshot.val();
            if (state) {
              setCardTitle(state.cardTitle);
              setOldCardTitle(state.cardTitle);
              setLoading(false);
            } else {
              setLoading(false);
            }
          });
      }
    });
  }, []);

  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  const handleClick = () => {
    let path = cardTitle.split(" ").join("_");
    props.history.push(`${props.username}/${path}`);
  };

  return (
    <Box display="flex" flex={1} className={classes.box}>
      {!props.editable && cardTitle && (
        <Link
          className={classes.button}
          href={
            "/" +
            props.match.params.username.toString() +
            "/" +
            cardTitle.split(" ").join("_")
          }
        >
          {loading && <div>Loading...</div>}
          <Typography className={classes.cardTitle}>{cardTitle}</Typography>
        </Link>
      )}
      {!props.editable && !cardTitle && props.personal && (
        <EditCard
          display="empty"
          oldCardTitle={oldCardTitle}
          cardTitle={cardTitle}
          cardNumber={props.cardNumber}
          editable={true}
          size={props.size}
        />
      )}
      {!props.editable && !cardTitle && !props.personal && (
        <Card className={classes.root} />
      )}
      {props.editable && (
        <Card className={classes.root}>
          <CardHeader
            style={{ padding: "16px 16px 0 0", height: "0px" }}
            action={
              <EditCard
                oldCardTitle={oldCardTitle}
                cardTitle={cardTitle}
                cardNumber={props.cardNumber}
                editable={props.editable}
                size={props.size}
              />
            }
          />
          <CardContent>
            {loading && <div>Loading...</div>}
            <Typography className={classes.cardTitle}>{cardTitle}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
const CardLink = compose(withRouter, withFirebase)(ProfileCard);

export default CardLink;
