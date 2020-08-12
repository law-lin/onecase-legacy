import React, { Component, Fragment, useState } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CardActionArea from "@material-ui/core/CardActionArea";
import PencilIcon from "@material-ui/icons/Create";
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
  category: {
    "&:hover": {
      outline: "none",
      backgroundColor: "#72b1cc",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    alignSelf: "center",
    textTransform: "none",
    fontSize: "20px",
    fontWeight: 700,
    backgroundColor: "#3E4E55",
    color: "#D4F1F3",
    borderRadius: "15px",
    height: "100px",
    width: "250px",
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
    minHeight: "70vh",
    maxHeight: "80vh",
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
    minHeight: "110px",
    width: "240px",
    borderRadius: "20px",
  },
});

function EditCard(props) {
  const classes = useStyles();
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
          } else {
            setError("A card with this category already exists!");
          }
        });
    }
  };

  const handleConfirmation = (selection) => {
    if (selection === "Yes") {
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
    <div>
      {props.editable && (
        <Fragment>
          {props.display === "none" && (
            <CardActionArea
              className={classes.card}
              style={{ padding: "16px 16px 0 0", height: "0px" }}
              onClick={handleOpen}
            />
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
              style: { backgroundColor: "#E4E4E4" },
            }}
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Choose this card's category!</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} alignItems="center">
                <Grid container item xs={12} spacing={3} align="center">
                  <Grid item xs={4} sm={4}>
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
                      onClick={() => handleClick("Art")}
                    >
                      Art
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
                </Grid>
                <Grid container item xs={12} spacing={3} align="center">
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Tech")}
                    >
                      Tech
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
                      onClick={() => handleClick("Fashion")}
                    >
                      Fashion
                    </Button>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3} align="center">
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Self-Improvement")}
                    >
                      Self-Improvement
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
                </Grid>
                <Grid container item xs={12} spacing={3} align="center">
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
                      onClick={() => handleClick("Time Capsule")}
                    >
                      Time Capsule
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Pets & Animals")}
                    >
                      Pets & Animals
                    </Button>
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3} align="center">
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Funny Stuff")}
                    >
                      Funny Stuff
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("School Projects")}
                    >
                      School Projects
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      className={classes.category}
                      onClick={() => handleClick("Entertainment")}
                    >
                      Entertainment
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {/* <FormControl>
                  <Select
                    defaultValue={props.cardTitle}
                    value={state.cardTitle}
                    onChange={handleChange}
                    input={<Input />}
                  >
                    <MenuItem value="School Projects">School Projects</MenuItem>
                    <MenuItem value="Photography">Photography</MenuItem>
                    <MenuItem value="Art">Art</MenuItem>
                    <MenuItem value="Music">Music</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                    <MenuItem value="Funny Stuff">Funny Stuff</MenuItem>
                    <MenuItem value="About Me">About Me</MenuItem>
                    <MenuItem value="Self-Improvement">
                      Self-Improvement
                    </MenuItem>
                    <MenuItem value="Time Capsule">Time Capsule</MenuItem>
                    <MenuItem value="Pets/Animals">Pets/Animals</MenuItem>
                    <MenuItem value="Photos of Self">Photos of Self</MenuItem>
                    <MenuItem value="Favorite Shows/Movies">
                      Favorite Shows/Movies
                    </MenuItem>
                    <MenuItem value="Favorite Books">Favorite Books</MenuItem>
                    <MenuItem value="Video Games">Video Games</MenuItem>
                    <MenuItem value="Tech">Tech</MenuItem>
                    <MenuItem value="Food">Food</MenuItem>)
                  </Select>
                </FormControl> */}
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
          </Dialog>
        </Fragment>
      )}
    </div>
  );
}

export default withFirebase(EditCard);
