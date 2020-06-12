import React, { Component } from 'react'

import { withFirebase } from './Firebase';

import './profile.css'

class Biography extends Component {
    constructor(props){
        super(props);

        this.state = {
            loading: false,
            bio: '',
        }
    }

    componentDidMount(){
        this.setState({ loading: true });
    
        this.props.firebase.bio().on('value', snapshot =>{
            const state = snapshot.val();
            if(state){
            this.setState({ 
                bio: state.bio,
                loading: false
            })
        }
            else{
                this.setState({ 
                    bio: 'Edit your bio with the pencil button!',
                    loading: false
                })
            }
            
        })
    }
    
    render() {
        const { loading, bio } = this.state
        return ( 
            <div className="bio">
                {loading && <div>Loading...</div>}
                {bio}
            </div>
        )
    }
}

export default withFirebase(Biography)
