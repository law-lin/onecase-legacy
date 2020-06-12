import React from 'react';
 
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
 
const withAuthentication = Component => {
  class WithAuthentication extends React.Component {

constructor(props){
    super(props);

    this.state = {
      authenticated: false,
      loading: true,
      user: null
    }
  }


  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: false,
          loading: true,
        });
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <AuthUserContext.Provider value={this.state.authenticated}>
        <Component {...this.props} />
      </AuthUserContext.Provider>
    );
  }
}
    return withFirebase(WithAuthentication)
}
export default withAuthentication;