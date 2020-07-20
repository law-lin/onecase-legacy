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

import background from "../images/background3.png";

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
      bridgeCardTitle: "",
      yearCreated: null,
      isProud: null,
      coworkers: null,
      whyMake: null,
      description: null,
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
              bridgeCardTitle: state.bridgeCardTitle,
              yearCreated: state.yearCreated,
              isProud: state.isProud,
              coworkers: state.coworkers,
              whyMake: state.whyMake,
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
    const {
      bridgeCardTitle,
      yearCreated,
      isProud,
      coworkers,
      whyMake,
      description,
      cardImageURL,
      loading,
    } = this.state;

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
                width: "75%",
              }}
            >
              <CardContent>
                {loading && <div>Loading...</div>}
                <h1>{bridgeCardTitle}</h1>
              </CardContent>
            </CardActionArea>

            <Dialog
              fullWidth={true}
              maxWidth={"lg"}
              open={this.state.open}
              onClose={this.handleClose}
            >
              <DialogTitle>{bridgeCardTitle}</DialogTitle>

              <DialogContent dividers>
                <DialogContentText>
                  <Typography style={{ width: "50%" }} gutterBottom>
                    Year created: {yearCreated}
                  </Typography>
                  <Typography gutterBottom>
                    Am I proud of this? {isProud}{" "}
                  </Typography>
                  <Typography gutterBottom>
                    People I worked with: {coworkers}
                  </Typography>
                  <Typography gutterBottom>
                    Why'd you make it? {whyMake}{" "}
                  </Typography>
                  <Typography gutterBottom>
                    Description: {description}{" "}
                  </Typography>
                  <img src={cardImageURL} />
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {this.props.editable && (
          <Card className={classes.root}>
            <CardContent>
              {loading && <div>Loading...</div>}
              <h1>{bridgeCardTitle}</h1>
            </CardContent>
            <CardActions>
              <EditBridgeCard
                bridgeCardTitle={bridgeCardTitle}
                yearCreated={yearCreated}
                isProud={isProud}
                coworkers={coworkers}
                whyMake={whyMake}
                description={description}
                cardImageURL={cardImageURL}
                cardNumber={this.props.cardNumber}
                bridgeCardNumber={this.props.bridgeCardNumber}
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
)(BridgeCard);

export default CardLink;
