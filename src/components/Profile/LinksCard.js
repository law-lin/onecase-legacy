import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";

import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Divider, CardActionArea } from "@material-ui/core";

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
});

function LinksCard(props) {
  const classes = useStyles();

  const [linkCard1Title, setLinkCard1Title] = useState("");
  const [linkCard2Title, setLinkCard2Title] = useState("");
  const [linkCard3Title, setLinkCard3Title] = useState("");
  const [linkCard1URL, setLinkCard1URL] = useState("");
  const [linkCard2URL, setLinkCard2URL] = useState("");
  const [linkCard3URL, setLinkCard3URL] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    let username = props.match.params.username.toString().toLowerCase();
    setLoading(true);
    props.firebase.getIDWithUsername(username).on("value", (snapshot) => {
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
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  /*
  const handleClick = (linkURL) => {
    const urlregexp = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    if (urlregexp.test(linkURL)) {
      if (!~linkURL.indexOf("http")) {
        linkURL = "http://" + linkURL;
      }
      window.open(linkURL);
    }
  };
  */

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardContent>
          <h1 className={classes.header}>Links</h1>
          <Divider className={classes.divider} />
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.gridItem}>
              {linkCard1URL && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={linkCard1URL}
                  className={classes.button}
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
    </React.Fragment>
  );
}

export default withFirebase(withRouter(LinksCard));
