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
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import EditBridgeCard from "./EditBridgeCard";
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

class BridgeCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      cardNumber: null,
      bridgeCardNumber: null,
      parentCardTitle: null,
      cardTitle: "",
      cardImageURL: null,
      loading: false,
      open: false,
      progress: 0,
    };
  }

  componentDidMount() {
    // this.setState({ loading: true });
    const username = this.props.match.params.username;
    const parentCardTitle = this.props.match.params.cardTitle;

    this.setState({ parentCardTitle });
    if (this.state.userID == null || this.state.cardTitle == null) {
      this.props.firebase
        .bridgeCards(
          this.props.userID,
          this.props.cardNumber,
          this.props.bridgeCardNumber
        )
        .on("value", (snapshot) => {
          const state = snapshot.val();
          if (state) {
            this.setState({
              cardTitle: state,
              loading: false,
            });
          } else {
            this.setState({
              cardTitle: "Edit this card info!",
              cardImageURL: null,
              loading: false,
            });
          }
        });
    }
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

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };
  // handleClick = () => {
  //   let cardTitlePath = this.state.parentCardTitle;
  //   let bridgeCardTitlePath = this.state.cardTitle
  //     .toLowerCase()
  //     .split(" ")
  //     .join("_");
  //   this.props.history.push(`${cardTitlePath}/${bridgeCardTitlePath}`);
  // };

  render() {
    const { classes } = this.props;
    const { cardTitle, cardImageURL, loading } = this.state;

    return (
      <div>
        {!this.props.editable && (
          <div>
            <CardActionArea
              onClick={this.handleClick}
              disabled={this.props.editable}
              className={classes.root}
              style={{ backgroundColor: "white" }}
            >
              <CardContent>
                {loading && <div>Loading...</div>}
                <h1>{cardTitle}</h1>
              </CardContent>
            </CardActionArea>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">{cardTitle}</DialogTitle>

              <DialogContent>
                <DialogContentText></DialogContentText>
              </DialogContent>
              <DialogActions>
                <button
                  className="btn btn-danger log"
                  onClick={this.handleClose}
                  color="primary"
                >
                  Cancel
                </button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {this.props.editable && (
          <Card
            className={classes.root}
            style={{
              backgroundSize: "350px 160px",
              backgroundImage: `url(${cardImageURL})`,
            }}
          >
            <CardContent>
              {loading && <div>Loading...</div>}
              <h1>{cardTitle}</h1>
            </CardContent>
            <CardActions>
              <EditBridgeCard
                cardTitle={cardTitle}
                cardNumber={this.props.cardNumber}
                bridgeCardNumber={this.props.bridgeCardNumber}
                editable={this.props.editable}
                size="small"
              />
              <div>
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
              </div>
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
)(BridgeCard);

export default CardLink;
