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


class LoginPage extends React.Component {
    state = {
        username: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleLoginForm = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/login', {
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

        console.log(this.props)

       return (

        <Container className="test" component="main" maxWidth="xs">
                <CssBaseline />
                <div >
                    <div className="avatar">
                    <Avatar >
                    <LockOutlinedIcon classname="avatar"/>
                    </Avatar>
                    <Typography classname="centered-text" component="h1" variant="h5">
                    Log in
                    </Typography>
                    </div>
                    <form onSubmit={this.handleLoginForm}  noValidate>
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
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                        </Grid>
                    </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    {this.Copyright}
                </Box>
                </Container>



        );
    }
}

export default LoginPage;