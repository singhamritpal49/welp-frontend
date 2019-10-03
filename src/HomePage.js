import React from "react";
import {Link} from "react-router-dom";

class HomePage extends React.Component {
    render(){
        console.log(this.props);
        
        return (
            <div>
                <h1>Home page</h1>
                <Link to="/profile">Go to profile page</Link>
            </div>
        );
    }
}

export default HomePage;