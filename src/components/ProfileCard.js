import React, { Component } from 'react';

import { withFirebase } from './Firebase';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import EditCard from './EditCard';

const styles = () => ({
  root: {
    width: 350,
    height: 160,
    backgroundColor: '#49de93',
    
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class ProfileCard extends Component{
  constructor(props){
    super(props);

    this.state = {
        cardInfo: '',
        loading: false,
    }
}


componentDidMount(){
  this.setState({ loading: true });

  this.props.firebase.card(this.props.cardNumber).on('value', snapshot =>{
      const state = snapshot.val();
      if(state){
      this.setState({ 
          cardInfo: state.cardInfo,
          loading: false
      })
  }
      else{
          this.setState({ 
              cardInfo: 'Edit this card below!',
              loading: false
          })
      }
  })
}

      render(){
          const { classes } = this.props;
          const { cardInfo, loading } = this.state
        return (
          <Card className={classes.root}>
            <CardContent>
              {loading && <div>Loading...</div>}
              <h1>{cardInfo}</h1>
            </CardContent>
            <CardActions>
              <EditCard cardNumber={this.props.cardNumber} size="small"/>
            </CardActions>
          </Card>
        );
}
 
}

export default withFirebase(withStyles(styles)(ProfileCard));