import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import { withStyles } from "@material-ui/core/styles";
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

import background from "../../images/background3.png";

import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import EditBridgeCard from "./EditBridgeCard";
import { CardActionArea } from "@material-ui/core";

const styles = () => ({
  root: {
    color: "#3B3C3B",
    backgroundColor: "#FFFFFF",
    minHeight: "200px",
    height: "200px",
    width: "200px",
    boxShadow: "none",
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
    fontSize: "36px",
    padding: "5px 20px",
    borderRadius: "15px",
    width: "fit-content",
  },
  dialog: {
    color: "#FFFFFF",
    backgroundColor: "#232323",
  },
  caption: {
    minHeight: "150px",
    fontFamily: "Mukta Mahee",
    color: "#FFFFFF",
    fontSize: "32px",
    fontWeight: 700,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      height: "3px",
    },
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
    marginTop: "20px",
    minHeight: "350px",
    fontFamily: "Mukta Mahee",
    color: "#FFFFFF",
    fontSize: "24px",
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
      bridgeCardTitle: "",
      caption: "",
      description: "",
      cardImageURL: null,
      coverCardImageURL: null,
      loading: false,
      open: false,
      progress: 0,
    };
  }

  componentDidMount() {
    // this.setState({ loading: true });
    const username = this.props.match.params.username;
    const parentCardTitle = this.props.match.params.cardTitle;

    this.setState({ parentCardTitle, loading: true });
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
              bridgeCardTitle: state.bridgeCardTitle,
              caption: state.caption,
              description: state.description,
              cardCoverImageURL: state.cardCoverImageURL,
              cardImageURL: state.cardImageURL,
              loading: false,
            });
          } else {
            this.setState({
              bridgeCardTitle: null,
              cardImageURL: null,
              loading: false,
            });
          }
        });
    }
  }

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
    const {
      bridgeCardTitle,
      caption,
      description,
      cardImageURL,
      cardCoverImageURL,
      loading,
    } = this.state;

    return (
      <div>
        {!this.props.editable && bridgeCardTitle && (
          <React.Fragment>
            <CardActionArea
              onClick={this.handleClick}
              className={classes.button}
              style={{
                background: cardCoverImageURL
                  ? `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${cardCoverImageURL}) 0 0/200px 200px no-repeat`
                  : "#FFFFFF 0 0/200px 200px no-repeat",
              }}
            >
              <CardContent>
                {loading && <div>Loading...</div>}
                <Typography className={classes.cardTitle}>
                  {bridgeCardTitle}
                </Typography>
              </CardContent>
            </CardActionArea>

            <Dialog
              fullWidth={true}
              maxWidth={"lg"}
              open={this.state.open}
              onClose={this.handleClose}
              PaperProps={{
                style: {
                  backgroundColor: "#232323",
                },
              }}
            >
              <DialogTitle>
                <Typography className={classes.title}>
                  {bridgeCardTitle}
                </Typography>
              </DialogTitle>

              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
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
                            style={{ maxWidth: "500px", maxHeight: "500px" }}
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
                  </Grid>
                  <Grid item xs={6}>
                    <Typography className={classes.caption}>
                      {caption}
                    </Typography>
                    <Typography gutterBottom className={classes.description}>
                      {description}
                    </Typography>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </React.Fragment>
        )}
        {!this.props.editable && !bridgeCardTitle && this.props.personal && (
          <EditBridgeCard
            display="none"
            bridgeCardTitle={bridgeCardTitle}
            caption={caption}
            description={description}
            cardImageURL={cardImageURL}
            cardCoverImageURL={cardCoverImageURL}
            cardNumber={this.props.cardNumber}
            bridgeCardNumber={this.props.bridgeCardNumber}
            editable={true}
            size="small"
          />
        )}
        {!this.props.editable && !bridgeCardTitle && !this.props.personal && (
          <Card className={classes.root}></Card>
        )}
        {this.props.editable && (
          <Card
            className={classes.root}
            style={{
              background: cardCoverImageURL
                ? `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${cardCoverImageURL}) 0 0/200px 200px no-repeat`
                : "#FFFFFF 0 0/200px 200px no-repeat",
            }}
          >
            <CardHeader
              style={{ padding: "16px 16px 0 0", height: "0px" }}
              action={
                <EditBridgeCard
                  bridgeCardTitle={bridgeCardTitle}
                  caption={caption}
                  description={description}
                  cardImageURL={cardImageURL}
                  cardNumber={this.props.cardNumber}
                  bridgeCardNumber={this.props.bridgeCardNumber}
                  editable={this.props.editable}
                  size="small"
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
