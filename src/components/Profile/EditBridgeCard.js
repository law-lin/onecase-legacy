import React, { Component, Fragment } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";

import PencilIcon from "@material-ui/icons/Create";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

import { withStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";

// Icons

const styles = () => ({
  root: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 700,
    fontSize: "100px",
  },
  input: {
    fontSize: "36px",
  },
  description: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    color: "#000000",
    backgroundColor: "white",
    fontSize: "24px",
  },
  button: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#C4C4C4",
    },
    "&:focus": {
      outline: "none",
    },
    width: "30px",
    height: "30px",
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "grey",
    color: "white",
    borderRadius: "15px",
  },
  save: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#52bf75",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#05872e",
    color: "white",
    borderRadius: "15px",
    width: "10%",
    height: "25%",
    marginRight: "1.5%",
  },
  cancel: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#f07171",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    backgroundColor: "#f03737",
    color: "white",
    borderRadius: "15px",
    width: "10%",
    height: "25%",
  },
});

class EditBridgeCard extends Component {
  state = {
    name: "",
    open: false,
    cardNumber: null,
    cardImage: null,
    bridgeCardNumber: null,
    bridgeCardTitle: null,
    description: "",
    imageLoading: true,
    imagePreviewURL: null,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let cardImage = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        cardImage,
        imagePreviewURL: reader.result,
      });
    };

    reader.readAsDataURL(cardImage);
  };

  handleSubmit = () => {
    const {
      cardImage,
      bridgeCardTitle,
      cardNumber,
      bridgeCardNumber,
      description,
    } = this.state;
    this.props.firebase.editBridgeCard(
      cardNumber,
      bridgeCardNumber,
      bridgeCardTitle,
      description
    );

    if (cardImage != null) {
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
          console.log(error);
        },
        () => {
          this.props.firebase.uploadCardImageURL(
            this.props.cardNumber,
            this.props.bridgeCardNumber,
            cardImage
          );
        }
      );
    }
    this.handleClose();
  };

  render() {
    const CHARACTER_LIMIT = 600;
    const { classes } = this.props;
    console.log("ok");
    console.log(this.state.yearCreated);
    console.log(this.state.isProud);
    console.log(this.state.whyMake);
    return (
      <div>
        {this.props.editable && (
          <Fragment>
            <IconButton
              className={classes.button}
              tip="Edit Card"
              onClick={this.handleOpen}
            >
              <PencilIcon />
            </IconButton>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              fullWidth={true}
              maxWidth={"lg"}
              PaperProps={{
                style: { backgroundColor: "#E4E4E4" },
              }}
            >
              <DialogTitle>
                <TextField
                  name="bridgeCardTitle"
                  type="text"
                  placeholder="Ex: Amazing Art, Vivid Views"
                  InputProps={{
                    className: classes.input,
                    disableUnderline: true,
                  }}
                  multiline
                  rows={1}
                  rowsMax={2}
                  styles={{ height: 500 }}
                  defaultValue={this.props.bridgeCardTitle}
                  value={this.state.bridgeCardTitle}
                  onChange={this.handleChange}
                  fullWidth
                />
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <React.Fragment>
                      {!this.state.imagePreviewURL && (
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            backgroundColor: "#C4C4C4",
                            minHeight: "350px",
                            width: "100%",
                          }}
                        >
                          <input
                            type="file"
                            ref={(fileUpload) => {
                              this.fileUpload = fileUpload;
                            }}
                            style={{ display: "none" }}
                            onChange={this.handleImageChange}
                          />
                          <IconButton onClick={() => this.fileUpload.click()}>
                            <CameraAltIcon />
                          </IconButton>
                        </Grid>
                      )}

                      {this.state.imagePreviewURL && (
                        <Grid
                          container
                          justify="center"
                          alignItems="center"
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <input
                            type="file"
                            ref={(fileUpload) => {
                              this.fileUpload = fileUpload;
                            }}
                            style={{ display: "none" }}
                            onChange={this.handleImageChange}
                          />
                          <IconButton onClick={() => this.fileUpload.click()}>
                            <img
                              style={{ minHeight: "90%", width: "100%" }}
                              src={this.state.imagePreviewURL}
                              alt="preview bridge card img"
                            />
                          </IconButton>
                        </Grid>
                      )}
                    </React.Fragment>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="description"
                      type="text"
                      placeholder="Ex: Describe what you did"
                      rows={12}
                      multiline
                      InputProps={{
                        className: classes.description,
                        disableUnderline: true,
                      }}
                      inputProps={{
                        maxlength: CHARACTER_LIMIT,
                      }}
                      defaultValue={this.props.description}
                      onChange={this.handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button className={classes.cancel} onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button className={classes.save} onClick={this.handleSubmit}>
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withFirebase(withStyles(styles)(EditBridgeCard));
