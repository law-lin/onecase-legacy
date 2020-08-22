import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

import { withFirebase } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minWidth: "280px",
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "25px",
  },
  header: {
    textAlign: "left",
    fontWeight: 800,
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
    fontSize: "24px",
    fontWeight: 800,
    minHeight: 50,
    width: "100%",
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

  const [trendingCategories, setTrendingCategories] = useState([]);

  useEffect(() => {
    props.firebase.getTrendingCategories().on("value", (snapshot) => {
      var results = [];
      for (var i in snapshot.val()) {
        results.push(i);
      }
      setTrendingCategories(results);
    });
  }, []);

  return (
    <Card className={classes.root}>
      <CardContent>
        <h1 className={classes.header}>Trending Sections</h1>
        <Grid container spacing={3}>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[0] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[0]}`}
                >
                  {trendingCategories[0]}
                </Link>
              )}
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[1] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[1]}`}
                >
                  {trendingCategories[1]}
                </Link>
              )}
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[2] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[2]}`}
                >
                  {trendingCategories[2]}
                </Link>
              )}
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[3] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[3]}`}
                >
                  {trendingCategories[3]}
                </Link>
              )}
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[4] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[4]}`}
                >
                  {trendingCategories[4]}
                </Link>
              )}
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              {trendingCategories[5] && (
                <Link
                  className={classes.button}
                  href={`/categories/${trendingCategories[5]}`}
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
}

export default withFirebase(CategoriesCard);
