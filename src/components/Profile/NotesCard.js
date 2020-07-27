import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Divider, TextField } from "@material-ui/core";

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
  header: {
    fontWeight: 800,
  },
  divider: {
    backgroundColor: "white",
    height: "5px",
    borderRadius: "20px",
  },
  notes: {
    fontWeight: 500,
    marginTop: "10px",
    textAlign: "left",
  },
  editNotes: {
    marginTop: "10px",
    textAlign: "left",

    width: "100%",
  },
  input: {
    color: "#FFFFFF",
  },
});

function NotesCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {!props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Notes</h1>
            <Divider className={classes.divider} />
            <p className={classes.notes}>blah blah blah</p>
          </CardContent>
          <CardActions>
            <Button size="small"></Button>
          </CardActions>
        </Card>
      )}
      {props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Notes</h1>
            <Divider className={classes.divider} />
            <TextField
              className={classes.editNotes}
              defaultValue={props.notes}
              multiline
              rows={6}
              rowsMax="6"
              InputProps={{ disableUnderline: true, className: classes.input }}
            />
          </CardContent>
          <CardActions>
            <Button size="small"></Button>
          </CardActions>
        </Card>
      )}
    </React.Fragment>
  );
}

export default NotesCard;
