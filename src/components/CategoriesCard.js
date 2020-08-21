import React from "react";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

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

function CategoriesCard() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <h1 className={classes.header}>Trending Sections</h1>
        <Grid container spacing={3}>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
            <Grid item xs={6} className={classes.gridItem}>
              <Link className={classes.button}>ok</Link>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default CategoriesCard;
