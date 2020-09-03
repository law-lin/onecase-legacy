import React, { useState } from "react";
import { TextField, Box, Typography, Button } from "@material-ui/core";
import Navbar from "./Navbar";
import { makeStyles } from "@material-ui/styles";
import { withFirebase } from "./Firebase";
const useStyles = makeStyles({
  container: {
    margin: "80px auto 0 auto",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "70vh",
  },
  text: {
    width: "700px",
    fontSize: "3vh",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontWeight: "bolder",
    color: "red",
  },
});
function PasswordResetPage(props) {
  const classes = useStyles();

  const [email, setEmail] = useState(null);

  const handleSubmit = () => {
    props.firebase.doPasswordReset(email);
  };

  return (
    <div className="bg">
      <Navbar />
      <Box display="flex" className={classes.container}>
        <Box className={classes.center} flex={1}>
          <Typography className={classes.text}>
            Find your OneCase account
          </Typography>
          <br />
          <TextField
            type="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>
      </Box>
    </div>
  );
}

export default withFirebase(PasswordResetPage);
