import React, { Component } from "react";

import { withFirebase } from "./Firebase";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import UploadButton from "./UploadButton";
import Typography from "@material-ui/core/Typography";

import EditCard from "./EditCard";
import { CardActionArea } from "@material-ui/core";

const styles = () => ({
  root: {
    width: 350,
    height: 160,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
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
      cardInfo: "",
      cardImageURL: null,
      loading: false,
      progress: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.card(this.props.cardNumber).on("value", (snapshot) => {
      const state = snapshot.val();
      if (state) {
        this.setState({
          cardInfo: state.cardInfo,
          cardImageURL: state.cardImageURL,
          loading: false,
        });
      } else {
        this.setState({
          cardInfo: "Edit this card below!",
          cardImageURL: null,
          loading: false,
        });
      }
    });
  }

  handleChange = (e) => {
    if (e.target.files[0]) {
      const cardImage = e.target.files[0];
      this.props.firebase.uploadCardImage(cardImage).on(
        "state_changed",
        (snapshot) => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        (error) => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          this.props.firebase.uploadCardImageURL(
            this.props.cardNumber,
            cardImage
          );
        }
      );
    }
  };

  render() {
    const { classes } = this.props;
    const { cardInfo, cardImageURL, loading } = this.state;
    return (
      <CardActionArea
        className={classes.root}
        style={{
          backgroundSize: "350px 160px",
        }}
      >
        <Card
          className={classes.root}
          style={{
            backgroundSize: "350px 160px",
            backgroundImage: `url(${cardImageURL})`,
          }}
        >
          <CardContent>
            {loading && <div>Loading...</div>}
            <h1>{cardInfo}</h1>
          </CardContent>
          <CardActions>
            <EditCard cardNumber={this.props.cardNumber} size="small" />
            <input
              type="file"
              id={this.props.cardNumber}
              className={classes.input}
              onChange={this.handleChange}
            />
            <label htmlFor={this.props.cardNumber}>
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </CardActions>
        </Card>
      </CardActionArea>
    );
  }
}

export default withFirebase(withStyles(styles)(ProfileCard));
