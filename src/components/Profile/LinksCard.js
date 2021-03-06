import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { ImLink } from "react-icons/im";

import { useParams } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Mixpanel } from "../Mixpanel";

import { Divider, CardHeader, IconButton, Snackbar } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: "280px",
    maxWidth: "280px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
  header: {
    textAlign: "left",
    fontWeight: 800,
  },
  divider: {
    backgroundColor: "white",
    height: "5px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    "&:hover": {
      outline: "none",
      textDecoration: "none",
      color: "#FFFFFF",
    },
    "&:active": {
      color: "#ABABAB",
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
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  copyLink: {
    "&:focus": {
      outline: "none",
    },
    "&:active": {
      color: "#ABABAB",
    },
    color: "#FFFFFF",
  },
});

function LinksCard(props) {
  const classes = useStyles();

  const [linkCard1Title, setLinkCard1Title] = useState("");
  const [linkCard2Title, setLinkCard2Title] = useState("");
  const [linkCard3Title, setLinkCard3Title] = useState("");
  const [linkCard1URL, setLinkCard1URL] = useState("");
  const [linkCard2URL, setLinkCard2URL] = useState("");
  const [linkCard3URL, setLinkCard3URL] = useState("");

  const [open, setOpen] = useState(false);

  let usernameParams = useParams().username.toLowerCase();
  useEffect(() => {
    props.firebase.getIDWithUsername(usernameParams).on("value", (snapshot) => {
      if (snapshot.val()) {
        props.firebase.user(snapshot.val()).on("value", (snapshot) => {
          const state = snapshot.val();
          if (state.linkCard1) {
            setLinkCard1Title(state.linkCard1.linkTitle);
            setLinkCard1URL(state.linkCard1.linkURL);
          }
          if (state.linkCard2) {
            setLinkCard2Title(state.linkCard2.linkTitle);
            setLinkCard2URL(state.linkCard2.linkURL);
          }
          if (state.linkCard3) {
            setLinkCard3Title(state.linkCard3.linkTitle);
            setLinkCard3URL(state.linkCard3.linkURL);
          }
        });
      }
    });
  }, [props.firebase, usernameParams]);

  const handleClick = (id) => {
    Mixpanel.track_links(id, "Link Click");
  };

  const copyToClipboard = () => {
    const url = window.location.href + "/links";
    var tempInput = document.createElement("input");
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardHeader
          style={{ padding: "16px 16px 0" }}
          title={<h1 className={classes.header}>Links</h1>}
          action={
            <IconButton className={classes.copyLink} onClick={copyToClipboard}>
              <ImLink />
            </IconButton>
          }
        />
        <CardContent style={{ padding: "0px 16px 16px" }}>
          <Divider className={classes.divider} />
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.gridItem}>
              {linkCard1URL && (
                <Link
                  id="link1"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={linkCard1URL}
                  className={classes.button}
                  onClick={handleClick("#link1")}
                >
                  {linkCard1Title}
                </Link>
              )}
              {!linkCard1URL && <Card className={classes.button}></Card>}
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
              {linkCard2URL && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={linkCard2URL}
                  className={classes.button}
                  id="link2"
                  onClick={handleClick("#link2")}
                >
                  {linkCard2Title}
                </Link>
              )}
              {!linkCard2URL && <Card className={classes.button}></Card>}
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
              {linkCard3URL && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={linkCard3URL}
                  className={classes.button}
                  id="link3"
                  onClick={handleClick("#link3")}
                >
                  {linkCard3Title}
                </Link>
              )}
              {!linkCard3URL && <Card className={classes.button}></Card>}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small"></Button>
        </CardActions>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Copied link to clipboard!"
      />
    </React.Fragment>
  );
}

export default withFirebase(LinksCard);
