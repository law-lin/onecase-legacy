import React, { useState, useEffect } from "react";
import UsernameButton from "./UsernameButton";

import Grid from "@material-ui/core/Grid";

import Navbar from "./Navbar";
import LeftNavbar from "./LeftNavbar";

import queryString from "query-string";
import { BrowserRouter as Router, Switch, useLocation } from "react-router-dom";
import { withFirebase } from "./Firebase";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "80px auto 0 auto",
    minWidth: "1224px",
    maxWidth: "1800px",
  },
});

function SearchResults(props) {
  let location = useLocation();
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    props.firebase
      .searchUsernames(queryString.parse(location.search).username)
      .once("value", (snapshot) => {
        const results = snapshot.val();
        let usernames = [];
        for (const username in results) {
          usernames.push(username);
        }
        setResults(usernames);
        setLoading(false);
      });
  }, []);

  if (!loading) {
    return (
      <div className="bg">
        <Navbar />
        <Grid container className={classes.root}>
          <Grid item sm={2}>
            {/* <LeftNavbar /> */}
          </Grid>
          <Grid item sm={10}>
            <ul>
              {results.map((result) => (
                <li>
                  <UsernameButton username={result} />
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
}

export default withFirebase(SearchResults);
