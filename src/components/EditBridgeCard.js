import React, { Component, Fragment } from "react";

// MUI Stuff
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { withFirebase } from "./Firebase";
// Icons

class EditBridgeCard extends Component {
  state = {
    name: "",
    open: false,
    cardNumber: null,
    bridgeCardNumber: null,
    bridgeCardTitle: null,
    yearCreated: null,
    isProud: null,
    coworkers: null,
    whyMake: null,
    description: null,
  };

  componentDidMount() {
    this.setState({
      cardNumber: this.props.cardNumber,
      bridgeCardNumber: this.props.bridgeCardNumber,
      bridgeCardTitle: this.props.bridgeCardTitle,
    });
  }
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = () => {
    const {
      bridgeCardTitle,
      cardNumber,
      bridgeCardNumber,
      yearCreated,
      isProud,
      coworkers,
      whyMake,
      description,
    } = this.state;
    console.log(cardNumber);
    this.props.firebase.editBridgeCard(
      cardNumber,
      bridgeCardNumber,
      bridgeCardTitle,
      yearCreated,
      isProud,
      coworkers,
      whyMake,
      description
    );
    this.handleClose();
  };
  render() {
    return (
      <div>
        {this.props.editable && (
          <Fragment>
            <Button tip="Edit Bridge Card" onClick={this.handleOpen}>
              EDIT BRIDGE CARD
            </Button>

            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Edit this bridge card</DialogTitle>
              <DialogContent>
                <form>
                  <TextField
                    name="bridgeCardTitle"
                    type="text"
                    label="Bridge Card Title"
                    multiline
                    rows={1}
                    rowsMax={2}
                    styles={{ height: 500 }}
                    defaultValue={this.props.bridgeCardTitle}
                    value={this.state.bridgeCardTitle}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    name="yearCreated"
                    type="text"
                    label="Year Created"
                    rowsMax={1}
                    styles={{ height: 500 }}
                    value={this.state.yearCreated}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    name="isProud"
                    type="text"
                    label="Am I Proud Of This?"
                    rowsMax={1}
                    styles={{ height: 500 }}
                    value={this.state.isProud}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    name="coworkers"
                    type="text"
                    label="People I Worked With:"
                    rowsMax={1}
                    styles={{ height: 500 }}
                    value={this.state.coworkers}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    name="whyMake"
                    type="text"
                    label="Why'd You Make It?"
                    rowsMax={1}
                    styles={{ height: 500 }}
                    value={this.state.whyMake}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    name="description"
                    type="text"
                    label="Description"
                    rowsMax={1}
                    styles={{ height: 500 }}
                    value={this.state.description}
                    onChange={this.handleChange}
                    fullWidth
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleSubmit} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withFirebase(EditBridgeCard);
