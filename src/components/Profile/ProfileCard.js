import React, { Component, useEffect, useState } from "react";

import { withFirebase } from "../Firebase";

import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import EditCard from "./EditCard";
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: "110px",
    width: (props) => (props.size === "small" ? "200px" : "250px"),
    borderRadius: "20px",
    boxShadow: "none",
  },
  button: {
    "&:hover": {
      outline: "none",
      color: "#FFFFFF",
      backgroundColor: "#3E4E55",
    },
    "&:focus": {
      outline: "none",
    },
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: "110px",
    width: (props) => (props.size === "small" ? "150px" : "250px"),
    borderRadius: "20px",
  },
  cardTitle: {
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "25px",
    fontWeight: 800,
    textAlign: "center",
    overflowWrap: "break-word",
  },
});

function ProfileCard(props) {
  const [cardTitle, setCardTitle] = useState(null);
  const [oldCardTitle, setOldCardTitle] = useState("placeholder");
  const [loading, setLoading] = useState(false);

  const classes = useStyles(props);

  console.log(props.size);

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
    <div>
      {!props.editable && cardTitle && (
        <Link
          href={
            "/" +
            props.match.params.username.toString() +
            "/" +
            cardTitle.split(" ").join("_")
          }
          style={{ textDecoration: "none" }}
        >
          <CardActionArea className={classes.button}>
            <CardContent>
              {loading && <div>Loading...</div>}
              <Typography className={classes.cardTitle}>{cardTitle}</Typography>
            </CardContent>
          </CardActionArea>
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
    </div>
  );
}
const CardLink = compose(withRouter, withFirebase)(ProfileCard);

export default CardLink;
