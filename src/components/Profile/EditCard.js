import React, { Fragment, useState } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CardActionArea from "@material-ui/core/CardActionArea";
import PencilIcon from "@material-ui/icons/Create";

import { IoMdClose } from "react-icons/io";
import { makeStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";
import { Typography } from "@material-ui/core";
// Icons

const useStyles = makeStyles({
  root: {
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 700,
    fontSize: "100px",
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
  title: {
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    fontSize: "30px",
    fontWeight: 800,
  },
  category: {
    "&:hover": {
      outline: "none",
      color: "#3E4E55",
      backgroundColor: "#D8D8D8",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: (props) =>
      props.size === "small"
        ? "17px"
        : props.size === "medium"
        ? "20px"
        : "25px",
    fontWeight: 800,
    backgroundColor: "#656464",
    color: "#FFFFFF",
    borderRadius: "15px",
    height: "100px",
    width: "100%",
  },
  confirmation: {
    fontSize: "24px",
  },
  yes: {
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
  no: {
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
  dialogPaper: {
    minHeight: "65vh",
    maxHeight: "80vh",
    borderRadius: "15px",
  },
  theme: {
    "&:hover": {
      outline: "none",
      color: "#FFFFFF",
      backgroundColor: "#3E4E55",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "black",
    color: "#FFFFFF",
    fontSize: (props) =>
      props.size === "small"
        ? "17px"
        : props.size === "medium"
        ? "20px"
        : "30px",
    fontWeight: 800,
    borderRadius: "15px",
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  card: {
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
    width: "100%",
    minHeight: (props) => (props.size === "small" ? "90px" : "110px"),
    minWidth: (props) => (props.size === "small" ? "160px" : "180px"),
    maxWidth: (props) => (props.size === "small" ? "175px" : "230px"),
    margin: "10px 10px",
    borderRadius: "20px",
  },
  close: {
    "&:focus": {
      outline: "none",
    },
    color: "#FFFFFF",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

function EditCard(props) {
  const classes = useStyles(props);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [oldCardTitle, setOldCardTitle] = useState(props.oldCardTitle);
  const [confirmation, setConfirmation] = useState(false);

  const handleOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleClick = (category) => {
    if (category === "None") {
      if (oldCardTitle !== "placeholder") {
        setConfirmation(true);
      } else {
        handleClose();
      }
    } else {
      props.firebase
        .checkDuplicateCardTitle(category)
        .once("value", (snapshot) => {
          if (!snapshot.exists()) {
            setError(null);
            setOldCardTitle(category);
            props.firebase.editCard(oldCardTitle, props.cardNumber, category);
            handleClose();
            if (props.bridge) {
              let newLocation = category.split(" ").join("_");
              window.location.href = newLocation;
            }
          } else {
            setError("A card with this category already exists!");
          }
        });
    }
  };

  const handleConfirmation = (selection) => {
    if (selection === "Yes") {
      window.location.href = "/" + props.username;
      setConfirmation(false);
      props.firebase.deleteCard(oldCardTitle, props.cardNumber);
      handleClose();
    } else {
      setConfirmation(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(null);
  };
  return (
    <React.Fragment>
      {props.editable && (
        <Fragment>
          {props.display === "none" && (
            <CardActionArea className={classes.theme} onClick={handleOpen}>
              {oldCardTitle}
            </CardActionArea>
          )}
          {props.display === "empty" && (
            <CardActionArea className={classes.card} onClick={handleOpen} />
          )}
          {!props.display && (
            <IconButton
              className={classes.button}
              tip="Edit Card"
              onClick={handleOpen}
            >
              <PencilIcon />
            </IconButton>
          )}

          <Dialog
            classes={{ paper: classes.dialogPaper }}
            PaperProps={{
              style: { backgroundColor: "#232323" },
            }}
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              <Typography className={classes.title}>Choose A Theme</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} alignItems="center">
                <Grid container item xs={12} spacing={3} align="center">
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("None")}
                    >
                      None
                    </Button>
                    <Dialog open={confirmation}>
                      <DialogContent>
                        <Typography className={classes.confirmation}>
                          Are you sure you want to set no category for this
                          card? All associated bridge cards with this card will
                          also be erased.
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          className={classes.yes}
                          onClick={() => handleConfirmation("Yes")}
                        >
                          Yes
                        </Button>
                        <Button
                          className={classes.no}
                          onClick={() => handleConfirmation("No")}
                        >
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Fashion")}
                    >
                      Fashion
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Music")}
                    >
                      Music
                    </Button>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Projects")}
                    >
                      Projects
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Art")}
                    >
                      Art
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Photography")}
                    >
                      Photography
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Fun Stuff")}
                    >
                      Fun Stuff
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Food")}
                    >
                      Food
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Stuff I Like")}
                    >
                      Stuff I Like
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Fitness")}
                    >
                      Fitness
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("About Me")}
                    >
                      About Me
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Random")}
                    >
                      Random
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Snackbar
                open={error}
                autoHideDuration={6000}
                onClose={handleAlertClose}
              >
                <MuiAlert onClose={handleAlertClose} severity="error">
                  {error}
                </MuiAlert>
              </Snackbar>
            </DialogContent>
            <DialogActions>
              <IconButton onClick={handleClose} className={classes.close}>
                <IoMdClose />
              </IconButton>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </React.Fragment>
  );
}

export default withFirebase(EditCard);
