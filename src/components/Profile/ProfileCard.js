import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
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
    width: "90%",
    height: 160,
  },
  bullet: {
    display: "inline-block",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  input: {
    display: "none",
  },
});

class ProfileCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      oldCardTitle: "",
      cardTitle: "",
      cardImageURL: null,
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
                cardImageURL: state.cardImageURL,
                loading: false,
              });
            } else {
              this.setState({
                cardTitle: "Edit this card!",
                oldCardTitle: "Edit this card!",
                cardImageURL: null,
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
    const { oldCardTitle, cardTitle, cardImageURL, loading } = this.state;

    return (
      <div>
        {!this.props.editable && (
          <CardActionArea
            onClick={this.handleClick}
            disabled={this.props.editable}
            className={classes.root}
            style={{ borderRadius: "20px", backgroundColor: "#ffffff" }}
          >
            <CardContent>
              {loading && <div>Loading...</div>}
              <h1>{cardTitle}</h1>
            </CardContent>
          </CardActionArea>
        )}
        {this.props.editable && (
          <Card
            className={classes.root}
            style={{
              borderRadius: "20px",
              backgroundImage: `url(${cardImageURL})`,
            }}
          >
            <CardContent>
              {loading && <div>Loading...</div>}
              <h1>{cardTitle}</h1>
            </CardContent>
            <CardActions>
              <EditCard
                oldCardTitle={oldCardTitle}
                cardTitle={cardTitle}
                cardNumber={this.props.cardNumber}
                editable={this.props.editable}
                size="small"
              />
            </CardActions>
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
