import React from "react";
import Link from "@material-ui/core/Link";

function UsernameButton(props) {
  return (
    <Link
      style={{ display: props.display, color: "black", fontSize: "32px" }}
      href={"/" + props.username}
    >
      {props.username}
    </Link>
  );
}

export default UsernameButton;
