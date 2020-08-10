import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import { withStyles } from "@material-ui/core/styles";
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

const styles = () => ({
  root: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    minHeight: "110px",
    width: "89.25%",
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
    width: "88%",
    borderRadius: "20px",
  },
  cardTitle: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontSize: "30px",
    fontWeight: 800,
    overflowWrap: "break-word",
  },
});

class ProfileCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      oldCardTitle: "placeholder",
      cardTitle: null,
      loading: false,
      progress: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const username = this.props.match.params.username.toString().toLowerCase();

    this.props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
      const userIDState = snapshot.val();
      if (userIDState) {
        this.setState({
          userID: userIDState,
        });
        this.props.firebase
          .cards(userIDState, this.props.cardNumber)
          .on("value", (snapshot) => {
            const state = snapshot.val();
            if (state) {
              this.setState({
                cardTitle: state.cardTitle,
                oldCardTitle: state.cardTitle,
                loading: false,
              });
            } else {
              this.setState({
                cardTitle: null,
                oldCardTitle: "placeholder",
                loading: false,
              });
            }
          });
      } else {
        this.setState({
          userID: null,
        });
      }
    });
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  handleClick = () => {
    let path = this.state.cardTitle.split(" ").join("_");
    this.props.history.push(`${this.props.username}/${path}`);
  };

  render() {
    const { classes } = this.props;
    const { oldCardTitle, cardTitle, loading } = this.state;

    return (
      <div>
        {!this.props.editable && cardTitle && (
          <Link
            href={
              "/" +
              this.props.match.params.username.toString() +
              "/" +
              this.state.cardTitle.split(" ").join("_")
            }
            style={{ textDecoration: "none" }}
          >
            <CardActionArea className={classes.button}>
              <CardContent>
                {loading && <div>Loading...</div>}
                <Typography className={classes.cardTitle}>
                  {cardTitle}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        )}
        {!this.props.editable && !cardTitle && (
          <EditCard
            display="none"
            oldCardTitle={oldCardTitle}
            cardTitle={cardTitle}
            cardNumber={this.props.cardNumber}
            editable={true}
            size="small"
          />
        )}
        {this.props.editable && (
          <Card className={classes.root}>
            <CardHeader
              style={{ padding: "16px 16px 0 0", height: "0px" }}
              action={
                <EditCard
                  oldCardTitle={oldCardTitle}
                  cardTitle={cardTitle}
                  cardNumber={this.props.cardNumber}
                  editable={this.props.editable}
                  size="small"
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
}
const CardLink = compose(
  withRouter,
  withFirebase,
  withStyles(styles)
)(ProfileCard);

export default CardLink;
