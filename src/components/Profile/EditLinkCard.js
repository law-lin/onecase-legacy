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
import IconButton from "@material-ui/core/IconButton";
import CardActionArea from "@material-ui/core/CardActionArea";

import PencilIcon from "@material-ui/icons/Create";
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
  dialogPaper: {
    minHeight: "70vh",
    maxHeight: "80vh",
  },
  card: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#898989",
    borderRadius: "20px",
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: 800,
    minHeight: 130,
    textAlign: "center",
    boxShadow: "none",
  },
});

function EditLinkCard(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState(props.linkTitle);
  const [linkURL, setLinkURL] = useState(props.linkURL);
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
      if (!~linkURL.indexOf("http")) {
        props.firebase.editLinkCard(
          props.linkCardNumber,
          linkTitle,
          "http://" + linkURL
        );
      } else {
        props.firebase.editLinkCard(props.linkCardNumber, linkTitle, linkURL);
      }
      handleClose();
    } else {
      setError("Please enter a valid URL!");
    }
  };

  return (
    <React.Fragment>
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
            defaultValue={props.linkTitle}
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
            defaultValue={props.linkURL}
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(e) => setLinkURL(e.target.value)}
            error={error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.cancel} onClick={handleClose}>
            Cancel
          </Button>
          <Button className={classes.save} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default withFirebase(EditLinkCard);
