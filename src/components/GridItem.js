import React, { Component } from 'react'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import ProfileCard from './ProfileCard';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

class GridItem extends Component{
    render(){
        const { classes } = this.props;
        return (
            <React.Fragment>
            <Grid item xs={4}>
                <ProfileCard/>
            </Grid>
            <Grid item xs={4}>
                <ProfileCard/>
            </Grid>
            <Grid item xs={4}>
            <ProfileCard/>
            </Grid>
            </React.Fragment>
        );
    }
}

export default (GridItem)