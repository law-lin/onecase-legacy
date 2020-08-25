import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { withFirebase } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { setDisplayName } from "recompose";

const useStyles = makeStyles({
  root: {
    // minWidth: "360px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
    marginTop: "100px",
    width: "100%",
  },
  header: {
    textAlign: "left",
    fontWeight: 800,
    fontSize: "2rem",
    fontFamily: ["Montserrat", "sans-serif"],
    marginBottom: "40px",
  },
  button: {
    "&:hover": {
      outline: "none",
      textDecoration: "none",
      color: "#ABABAB",
    },
    "&:focus": {
      outline: "none",
    },
    fontFamily: ["Montserrat", "sans-serif"],
    backgroundColor: "#3E4E55",
    borderRadius: "15px",
    color: "#FFFFFF",
    fontSize: "20px",
    fontWeight: 800,
    minHeight: 50,
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "none",
  },
  gridItem: {
    display: "flex",
    justifyContent: "center",
  },
});

function CategoriesCard(props) {
  const classes = useStyles();

  const [display, setDisplay] = useState(false);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [categoryLinks, setCategoryLinks] = useState([]);

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplay(true);
        props.firebase.getTrendingCategories().on("value", (snapshot) => {
          var links = [];
          var categories = [];
          for (var i in snapshot.val()) {
            categories.push(
              i.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
                return (
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
              })
            );
            links.push(i);
          }
          setTrendingCategories(categories);
          setCategoryLinks(links);
        });
      } else {
        setDisplay(false);
      }
    });
  }, []);

  if (display) {
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.header}>Trending Sections</Typography>
          <Grid container spacing={3}>
            <Grid container item xs={12}>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[0] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[0]}`}
                  >
                    {trendingCategories[0]}
                  </Link>
                )}
              </Grid>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[1] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[1]}`}
                  >
                    {trendingCategories[1]}
                  </Link>
                )}
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[2] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[2]}`}
                  >
                    {trendingCategories[2]}
                  </Link>
                )}
              </Grid>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[3] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[3]}`}
                  >
                    {trendingCategories[3]}
                  </Link>
                )}
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[4] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[4]}`}
                  >
                    {trendingCategories[4]}
                  </Link>
                )}
              </Grid>
              <Grid item xs={6} className={classes.gridItem}>
                {trendingCategories[5] && (
                  <Link
                    className={classes.button}
                    href={`/categories/${categoryLinks[5]}`}
                  >
                    {trendingCategories[5]}
                  </Link>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  } else {
    return null;
  }
}

export default withFirebase(CategoriesCard);
