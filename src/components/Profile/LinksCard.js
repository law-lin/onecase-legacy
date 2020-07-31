import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import EditLinkCard from "./EditLinkCard";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import { Divider, TextField, CardActionArea } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    margin: "0 5% 0 5%",
    minWidth: "90%",
    height: 700,
    backgroundColor: "#3E4E55",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
  header: {
    fontWeight: 800,
  },
  divider: {
    backgroundColor: "white",
    height: "5px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  link: {
    "&:hover": {
      outline: "none",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#859EA9",
    borderRadius: "20px",
    color: "#000000",
    fontSize: 30,
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

  const handleClick = (linkURL) => {
    if (!~linkURL.indexOf("http")) {
      linkURL = "http://" + linkURL;
    }
    window.location.href = linkURL;
  };
  return (
    <React.Fragment>
      {!props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Links</h1>
            <Divider className={classes.divider} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CardActionArea
                  className={classes.link}
                  onClick={() => handleClick(linkCard1URL)}
                >
                  <CardContent>{linkCard1Title}</CardContent>
                </CardActionArea>
              </Grid>
              <Grid item xs={12}>
                <CardActionArea
                  className={classes.link}
                  onClick={() => handleClick(linkCard2URL)}
                >
                  <CardContent>{linkCard2Title}</CardContent>
                </CardActionArea>
              </Grid>
              <Grid item xs={12}>
                <CardActionArea
                  className={classes.link}
                  onClick={() => handleClick(linkCard3URL)}
                >
                  <CardContent>{linkCard3Title}</CardContent>
                </CardActionArea>
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
                <Card>
                  <CardContent>
                    Title: {linkCard1Title}
                    <br />
                    URL: {linkCard1URL}
                  </CardContent>
                  <CardActions>
                    <EditLinkCard linkCardNumber="linkCard1" />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    Title: {linkCard2Title}
                    <br />
                    URL: {linkCard2URL}
                  </CardContent>
                  <CardActions>
                    <EditLinkCard linkCardNumber="linkCard2" />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    Title: {linkCard3Title}
                    <br />
                    URL: {linkCard3URL}
                  </CardContent>
                  <CardActions>
                    <EditLinkCard linkCardNumber="linkCard3" />
                  </CardActions>
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
