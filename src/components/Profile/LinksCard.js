import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/CardHeader";
import EditLinkCard from "./EditLinkCard";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Divider, TextField, CardActionArea } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    margin: "10% 5% 0 5%",
    maxWidth: "80%",

    backgroundColor: "#464646",
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
  button: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Mukta Mahee", "sans-serif"],
    backgroundColor: "#3E4E55",
    borderRadius: "20px",
    color: "#FFFFFF",
    fontSize: "30px",
    fontWeight: 600,
    minHeight: 130,
    textAlign: "center",
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
      {!props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Links</h1>
            <Divider className={classes.divider} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Link
                  target="_blank"
                  href={"//" + linkCard1URL}
                  style={{ textDecoration: "none" }}
                >
                  <CardActionArea className={classes.button}>
                    <CardContent>{linkCard1Title}</CardContent>
                  </CardActionArea>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link
                  target="_blank"
                  href={"//" + linkCard2URL}
                  style={{ textDecoration: "none" }}
                >
                  <CardActionArea className={classes.button}>
                    <CardContent>{linkCard2Title}</CardContent>
                  </CardActionArea>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link
                  target="_blank"
                  href={"//" + linkCard3URL}
                  style={{ textDecoration: "none" }}
                >
                  <CardActionArea className={classes.button}>
                    <CardContent>{linkCard3Title}</CardContent>
                  </CardActionArea>
                </Link>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button size="small"></Button>
          </CardActions>
        </Card>
      )}
      {props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Links</h1>
            <Divider className={classes.divider} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card className={classes.link}>
                  <CardHeader
                    style={{ padding: "5px 12px 0 0", height: "0" }}
                    action={
                      <EditLinkCard
                        linkCardNumber="linkCard1"
                        linkTitle={linkCard1Title}
                        linkURL={linkCard1URL}
                      />
                    }
                  />
                  <CardContent>{linkCard1Title}</CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.link}>
                  <CardHeader
                    style={{ padding: "5px 12px 0 0", height: "0" }}
                    action={
                      <EditLinkCard
                        linkCardNumber="linkCard2"
                        linkTitle={linkCard2Title}
                        linkURL={linkCard2URL}
                      />
                    }
                  />
                  <CardContent>{linkCard2Title}</CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card className={classes.link}>
                  <CardHeader
                    style={{ padding: "5px 12px 0 0", height: "0" }}
                    action={
                      <EditLinkCard
                        linkCardNumber="linkCard3"
                        linkTitle={linkCard3Title}
                        linkURL={linkCard3URL}
                      />
                    }
                  />
                  <CardContent>{linkCard3Title}</CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button size="small"></Button>
          </CardActions>
        </Card>
      )}
    </React.Fragment>
  );
}

export default withFirebase(withRouter(LinksCard));
