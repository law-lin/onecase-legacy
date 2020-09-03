import React, { useState, useEffect } from "react";

import SignUp from "./SignUp";
import { withFirebase } from "./Firebase";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  button: {
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
    },
    "&:active": {
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(38, 143, 255, 0.5)",
      outline: "none",
    },
    color: "#FFFFFF",
    display: "inline-block",
    backgroundColor: "#007bff",
    fontFamily: ["Mukta Mahee", "san-serif"],
    border: "1px solid transparent",
    borderColor: "#007bff",
    padding: "0.5rem 1rem",
    fontSize: "1.25rem",
    lineHeight: 1.5,
    borderRadius: "15px",
    transition:
      "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    fontWeight: 400,
    textTransform: "none",
  },
});
function AdminPage(props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [admin, setAdmin] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    props.firebase.users().on("value", (snapshot) => {
      const usersObject = snapshot.val();
      if (usersObject) {
        const usersList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
          uid: key,
        }));

        setUsers(usersList);
      }
    });
    setLoading(false);
  }, []);

  const validateLogin = () => {
    return password !== "" && email !== "";
  };
  const handleLogin = () => {
    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        console.log(user.user.uid);
        if (user.user.uid === "UGmUJDQMjPbubeVXq7pGz0IUObG3") {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      });
  };

  return (
    <div>
      {admin === null && (
        <React.Fragment>
          <h1>Admin</h1>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button disabled={!validateLogin()} onClick={handleLogin}>
            Login
          </Button>
        </React.Fragment>
      )}
      {admin === true && (
        <React.Fragment>
          <Button className={classes.button} onClick={() => setOpen(true)}>
            Create A New User
          </Button>
          <SignUp
            handleOpen={open}
            handleClose={() => setOpen(false)}
            admin={true}
          />
          <UserList users={users} />
        </React.Fragment>
      )}
      {admin === false && <React.Fragment>invalid user</React.Fragment>}
    </div>
  );
}

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <br />
        <span>
          <strong>Email:</strong> {user.email}
        </span>
        <br />
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(AdminPage);
