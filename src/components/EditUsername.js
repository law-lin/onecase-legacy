import React, { Component, Fragment } from 'react';

// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { withFirebase } from './Firebase';
// Icons
import EditIcon from '@material-ui/icons/Edit';


class EditUsername extends Component {
  state = {
    name: '',
    open: false
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  handleSubmit = () => {
      const { username } = this.state;
      this.props.firebase.editUsername(username);
    this.handleClose();
  }
  render() {
    return (
      <Fragment>
          <Button tip="Edit Username"
          onClick={this.handleOpen}>
            <EditIcon color ="primary" />
        </Button>
    
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your username</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="username"
                tpye="text"
                label="Username"
                multiline
                rows="1"
                placeholder="Update username"
                value={this.state.username}
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
    );
  }
}


export default withFirebase(EditUsername);