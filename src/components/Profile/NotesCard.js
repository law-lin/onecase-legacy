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
    maxWidth: "77%",
    height: 630,
    backgroundColor: "#232323",
    color: "#FFFFFF",
    fontFamily: ["Montserrat", "sans-serif"],
    borderRadius: "20px",
  },
  header: {
    fontWeight: 800,
    margin: "0 0 3% -35%",
  },
  divider: {
    backgroundColor: "white",
    height: "5px",
    borderRadius: "20px",
    width: "85%",
  },
  notes: {
    fontSize: "25px",
    fontWeight: 300,
    marginTop: "10px",
    marginLeft: "10px",
    marginRight: "13px",
    textAlign: "left",
    overflowWrap: "break-word",
    fontFamily: ["Mukta Mahee", "sans-serif"],
  },
  editNotes: {
    marginTop: "10px",
    textAlign: "left",
    width: "100%",
  },
  input: {
    color: "#000000",
    backgroundColor: "#FFFFFF",
    fontFamily: ["Mukta Mahee", "sans-serif"],
    fontWeight: 300,
    fontSize: "25px",
    lineHeight: 1.6,
    borderRadius: 10,
    height: "1px",
  },
});

function NotesCard(props) {
  const classes = useStyles();

  function handleChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <React.Fragment>
      {!props.editable && (
        <Card className={classes.root}>
          <CardContent>
            <h1 className={classes.header}>Notes</h1>
            <Divider className={classes.divider} />
            <Typography className={classes.notes}>{props.notes}</Typography>
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
              onChange={handleChange}
              defaultValue={props.notes}
              multiline
              rows={13}
              rowsMax="14"
              inputProps={{
                maxLength: 300,
                className: classes.input,
              }}
              InputProps={{
                disableUnderline: true,
              }}
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
