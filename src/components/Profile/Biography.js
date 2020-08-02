import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { withFirebase } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  input: {
    fontSize: "20px",
    fontFamily: ["Montserrat", "sans-serif"],
  },
  display: {
    height: "70px",
    marginTop: "70px",
    fontSize: "20px",
    fontFamily: ["Montserrat", "sans-serif"],
    whiteSpace: "pre-line",
  },
});

function Biography(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <React.Fragment>
      {props.editable && (
        <TextField
          label="Biography"
          defaultValue={props.bio}
          onChange={handleChange}
          multiline
          style={{
            marginTop: "70px",
            height: "70px",
            backgroundColor: "white",
            width: "100%",
            marginLeft: props.margin,
          }}
          rows={6}
          rowsMax="6"
          InputProps={{
            disableUnderline: true,
          }}
          inputProps={{ className: classes.input }}
        />
      )}
      {!props.editable && (
        <Typography
          className={classes.display}
          style={{ marginLeft: props.margin }}
        >
          {props.bio}
          <br />
        </Typography>
      )}
    </React.Fragment>
  );
}

export default withFirebase(Biography);
