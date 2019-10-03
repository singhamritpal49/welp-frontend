import React from 'react';
import MapPage from './MapPage';
import SignupPage from './SingupPage';
import LoginPage from './LoginPage';
import {Switch, Route} from 'react-router-dom';

class App extends React.Component {
  state = {
    username: '',
    user_id: 0
  }

  componentDidMount(){
    // if(localStorage.token){
    //   // this.redirect('profile');
    //   fetch('http://localhost:3000/profile', {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.token}`
    //         }
    //     })
    //     .then(resp => resp.json())
    //     .then(data => this.setState({username: data.username, user_id: data.id}))
    // }

    this.setState({username: '', user_id: 0})
  }

  render() {
  
     return (
       <Switch>
         <Route path={'/map'} render={(routerProps)=> <MapPage {...routerProps} /> } />
         <Route path={'/login'} render={(routerProps)=> <LoginPage {...routerProps} /> } />
         <Route path={'/signup'} render={(routerProps)=> <SignupPage {...routerProps} /> } />
         <Route path={'/'} render={(routerProps)=> <LoginPage {...routerProps} /> } />
       </Switch>
     )
    // switch(this.state.page){
    //   case 'login':
    //     return <LoginPage redirect={this.redirect} />
    //   case 'signup':
    //     return <SignupPage />
    //   case 'profile':
    //     return <ProfilePage redirect={this.redirect} />
    //   default:
    //     return <LoginPage />
    //   }
  }
}

export default App;