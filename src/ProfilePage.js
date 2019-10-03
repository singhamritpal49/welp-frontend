import React from 'react'

class ProfilePage extends React.Component {
    
    handleLogout = () => {
        this.setState({username: ''});
        localStorage.clear();
        this.props.history.push('/login');
    }

    render(){        
        return (
            <div>
                <h1>Welcome {this.props.username}</h1>
                <button onClick={this.handleLogout}>Log out</button>
            </div>
        );
    }
}

export default ProfilePage;