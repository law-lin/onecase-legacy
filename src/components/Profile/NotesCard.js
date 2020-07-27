import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    margin: "5% 5% 0 5%",
    minWidth: "90%",
    height: 700,
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "20px",
  },
  divider: {
    backgroundColor: "white",
    height: "5px",
    borderRadius: "20px",
  },
  notes: {
    marginTop: "10px",
    textAlign: "left",
  },
});

function NotesCard() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <h1>Notes</h1>
        <Divider className={classes.divider} />
        <p className={classes.notes}>blah blah blah</p>
      </CardContent>
      <CardActions>
        <Button size="small"></Button>
      </CardActions>
    </Card>
  );
}

export default NotesCard;
