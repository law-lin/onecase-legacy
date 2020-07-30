import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  edit: {
    backgroundColor: "white",
    width: "60%",
  },
  input: {
    fontSize: "28px",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
  },
  display: {
    fontSize: "28px",
    fontFamily: ["Montserrat", "sans-serif"],
    fontWeight: 700,
  },
});
function Username(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <React.Fragment>
      {props.editable && (
        <TextField
          className={classes.edit}
          defaultValue={props.username}
          onChange={handleChange}
          InputProps={{ disableUnderline: true }}
          inputProps={{ className: classes.input }}
        />
      )}
      {!props.editable && (
        <h2 className={classes.display} style={{ display: props.display }}>
          {props.username}
        </h2>
      )}
    </React.Fragment>
  );
}

export default withFirebase(Username);
