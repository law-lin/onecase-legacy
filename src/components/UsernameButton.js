import React from "react";
import Link from "@material-ui/core/Link";

function UsernameButton(props) {
  return (
    <Link
      style={{
        display: props.display,
        color: "#A82F2F",
        fontSize: "32px",
        fontFamily: ["Montserrat", "sans-serif"],
        fontWeight: 700,
      }}
      href={"/" + props.username}
    >
      {props.username}
    </Link>
  );
}

export default UsernameButton;
