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
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    minHeight: "120px",
    width: "89.25%",
    borderRadius: "20px",
  },
  cardTitle: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontSize: "30px",
    fontWeight: 800,
    overflowWrap: "break-word",
  },
  title: {
    fontSize: "36px",
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
      description: "",
      cardImageURL: "",
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
              bridgeCardTitle: state.bridgeCardTitle,
              description: state.description,
              cardImageURL: state.cardImageURL,
              loading: false,
            });
          } else {
            this.setState({
              bridgeCardTitle: "Edit this bridge card!",
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
    const { bridgeCardTitle, description, cardImageURL, loading } = this.state;

    return (
      <div>
        {!this.props.editable && (
          <div>
            <CardActionArea
              onClick={this.handleClick}
              disabled={this.props.editable}
              className={classes.root}
              style={{
                borderRadius: "20px",
                backgroundColor: "white",
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
            >
              <DialogTitle>
                <Typography className={classes.title}>
                  {bridgeCardTitle}
                </Typography>
              </DialogTitle>

              <DialogContent dividers>
                <DialogContentText>
                  <Grid container>
                    <Grid item xs={6}>
                      {cardImageURL && (
                        <img
                          style={{ height: "100%", width: "100%" }}
                          src={cardImageURL}
                          alt="Show off your project!"
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        gutterBottom
                        style={{
                          fontFamily: "Mukta Mahee",
                          color: "#000000",
                          fontSize: "24px",
                          fontWeight: 20,
                        }}
                      >
                        {description}
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {this.props.editable && (
          <Card
            className={classes.root}
            style={{
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          >
            <CardHeader
              style={{ padding: "12px 12px 0 0", height: "0" }}
              action={
                <EditBridgeCard
                  bridgeCardTitle={bridgeCardTitle}
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
