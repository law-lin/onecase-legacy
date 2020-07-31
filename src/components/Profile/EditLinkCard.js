import React, { Component, Fragment, useState } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { withFirebase } from "../Firebase";

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
    width: "25%",
    height: "25%",
    marginRight: "1.5%",
  },
  dialogPaper: {
    minHeight: "70vh",
    maxHeight: "80vh",
  },
});

function EditLinkCard(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState(null);
  const [linkURL, setLinkURL] = useState(null);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const urlregexp = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    if (urlregexp.test(linkURL)) {
      props.firebase.editLinkCard(props.linkCardNumber, linkTitle, linkURL);
      handleClose();
    } else {
      setError("Please enter a valid URL!");
    }
  };

  return (
    <div>
      <Fragment>
        <Button className={classes.button} tip="Edit Card" onClick={handleOpen}>
          Edit Card
        </Button>
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
          <DialogTitle>Edit this link!</DialogTitle>
          <DialogContent>
            <Typography
              style={{
                color: "#0FA9FF",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Title:
            </Typography>
            <TextField
              type="text"
              name="linkTitle"
              placeholder=""
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
            <Typography
              style={{
                color: "#0FA9FF",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Link
            </Typography>
            <TextField
              type="text"
              name="linkURL"
              placeholder="Ex: https://www.youtube.com/user/Vsauce"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => setLinkURL(e.target.value)}
              error={error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button className={classes.save} onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </div>
  );
}

export default withFirebase(EditLinkCard);
