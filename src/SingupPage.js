import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import "./App.scss"

class SignupPage extends React.Component {
    state = {
        username: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleForm = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/signup', {
            method: "POST",
            headers: {
                'Accept': 'Application/json',
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
              localStorage.token = data.token
              this.props.history.push('/map');
            }
          })
    }
      
      render(){

       return (

        <Container className="test" component="main" maxWidth="xs">
                <CssBaseline />
                <div >
                    <div className="avatar">
                    <Avatar >
                    <LockOutlinedIcon classname="avatar"/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign up
                    </Typography>
                    </div>
                    <form onSubmit={this.handleForm}  noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Your name"
                        name="username"
                        autoComplete="email"
                        autoFocus
                        onChange={this.handleChange} value={this.state.username} 
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={this.handleChange} value={this.state.password} 
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                        <Link href="/login" variant="body2">
                            {"Already have an account? Log in!"}
                        </Link>
                        </Grid>
                    </Grid>
                    </form>
                </div>
                </Container>



        );
    }
}

export default SignupPage;