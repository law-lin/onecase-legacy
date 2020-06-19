// import React, { Component } from "react";

// import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import { withFirebase } from "./Firebase";

// const styles = (theme) => ({
//   root: {
//     "& > *": {
//       margin: theme.spacing(1),
//     },
//   },
//   input: {
//     display: "none",
//   },
// });

// class UploadButton extends Component {
//   handleChange = (e) => {
//     console.log(this.props.cardNumber);
//     if (e.target.files[0]) {
//       const cardImage = e.target.files[0];
//       this.props.firebase.uploadCardImage(cardImage).on(
//         "state_changed",
//         (error) => {
//           // Error function ...
//           console.log(error);
//         },
//         () => {
//           // complete function ...
//           this.props.firebase.uploadCardImageURL(
//             this.props.cardNumber,
//             cardImage
//           );
//         }
//       );
//     }
//   };
//   render() {
//     const { classes } = this.props;
//     return (
//       <div className={classes.root}>
//         <input
//           accept="image/*"
//           className={classes.input}
//           id="contained-button-file"
//           multiple
//           type="file"
//           onChange={this.handleChange}
//         />
//         <label htmlFor="contained-button-file">
//           <Button variant="contained" color="primary" component="span">
//             Upload
//           </Button>
//         </label>
//       </div>
//     );
//   }
// }

// export default withFirebase(withStyles(styles)(UploadButton));
