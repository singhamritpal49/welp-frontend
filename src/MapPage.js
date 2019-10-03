import React from "react";
import {render} from 'react-dom';
import './App.scss'
import MapGL, {Marker, Popup, NavigationControl, FullscreenControl} from 'react-map-gl';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';

class MapPage extends React.Component {

    state = {
        viewport: {
            width: "100vw",
            height: "100vh",
            latitude: 0,
            longitude: 0,
            zoom: 15
        },
        username: '',
        user_id: 0,
        locations: [],

        // new review stuff
        newReviewOpen: false,
        locationName: '',
        newReviewLocationId: 0,
        reviews: [],

        // new location stuff
        newLocationOpen: false,
        reviewLat: 0,
        reviewLng: 0,
        newName: '',
        newLocationId: 0,
        newReviewBody: ''
    }

    componentWillMount(){
        navigator.geolocation.getCurrentPosition(position => {
            fetch(`http://localhost:3000/locations/${position.coords.latitude}/${position.coords.longitude}`)
            .then(resp => resp.json())
            .then(locations => this.setState({locations}))
            let newViewport = {
                height: "100vh",
                width: "100vw",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                zoom: 15
            }
            this.setState({
                viewport: newViewport
            });
        });
        this.getUser();
        this.fetchLocations();
        this.getMarkers();
    }
    
    // componentDidMount(){
    // }

    getUser = () => {
        if(localStorage.token){
            // this.redirect('profile');
            fetch('http://localhost:3000/profile', {
                  headers: {
                      'Authorization': `Bearer ${localStorage.token}`
                  }
              })
              .then(resp => resp.json())
              .then(data => this.setState({username: data.username, user_id: data.id}))
          }
    }

    fetchLocations = () => {
        fetch(`http://localhost:3000/locations/${this.state.viewport.latitude}/${this.state.viewport.longitude}`)
        .then(resp => resp.json())
        .then(locations => this.setState({locations}))
    }

    getMarkers = () => {
        return this.state.locations.map(location => {
            return (
                <Marker key={location.id} offsetLeft={-25} offsetTop={-70} latitude={parseFloat(location.lat)} longitude={parseFloat(location.lng)}>
                    <div className="marker-styles" onClick={() => {this.handleLocationClick(location.id)}} >
                        <p>{location.reviews.length}</p>
                    </div>
                </Marker>
            );
        });
    }

    onViewportChange = viewport => {
        this.setState({viewport});
        this.getUser();
        this.fetchLocations();
        this.getMarkers();
    }

    mapClick = event => {
        this.setState({reviewLat: event.lngLat[1], reviewLng: event.lngLat[0]})
        this.setState({newLocationOpen: true});
    }

    handleClose = () => {
        this.setState({newLocationOpen: false});
    }

    newLocationFormHandler = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    newLocationSubmitHandler = event => {
        event.preventDefault();
        fetch("http://localhost:3000/locations", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'location_name': this.state.newName,
                'lat': this.state.reviewLat,
                'lng': this.state.reviewLng
            })
        })
        .then(res => res.json())
        .then((finalResponse) =>
        fetch("http://localhost:3000/reviews", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'body': this.state.newReviewBody,
                'user_id': this.state.user_id,
                'location_id': finalResponse.id
            })
        }).then(()=> this.setState({newLocationOpen: false, newReviewBody: ''})));
        this.fetchLocations();
        this.getMarkers();
    }

    handleLocationClick = id => {
        this.setState({newReviewLocationId: id});
        fetch(`http://localhost:3000/reviews/${id}`)
        .then(response => response.json())
        .then(reviews => this.setState({reviews}));

        fetch(`http://localhost:3000/locations/${id}`)
        .then(resp => resp.json())
        .then(resp => this.setState({locationName: resp.location_name}))
        .then(()=> this.setState({newReviewOpen: true}))
    }

    handleReviewClose = () => {
        this.setState({newReviewOpen: false})
    }

    getReviews = () => {
        return this.state.reviews.map(review => {
            console.log(review)
            return (
                <div className="reviews">
                    <h4>{review.user.username}</h4>
                    <p>{review.body}</p>
                </div>
            );
        })
    }

    handleReviewClose = () => {
        this.setState({newReviewOpen: false})
    }

    newLocationFormHandler = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    newReviewSubmitHandler = event => {
        event.preventDefault();
        fetch("http://localhost:3000/reviews", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'body': this.state.newReviewBody,
                'user_id': this.state.user_id,
                'location_id': this.state.newReviewLocationId
            })
        });
        this.setState({newReviewOpen: false, newReviewBody: ''})
        this.fetchLocations();
        this.getMarkers();
    }

    handleLogout = () => {
        this.setState({username: ''});
        this.setState({id: 0});
        localStorage.clear();
        this.props.history.push('/login');
    }
    
    render(){
        const TOKEN='pk.eyJ1Ijoiam9obmZhamFyZG8iLCJhIjoiY2swcjVnZmFpMDBwMTNnbWd6ZWRwMG1nMiJ9.VwxkYPyVdPzoLc83t4mlqQ'

        return (
            <>
                <MapGL
                    {...this.state.viewport}
                    onClick={this.mapClick}
                    attributionControl={false}
                    onViewportChange={this.onViewportChange}
                    mapboxApiAccessToken={TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v10">{this.getMarkers()}</MapGL>
                    <div className="nav"><h1>Hello {this.state.username}<button onClick={this.handleLogout}>Log out</button></h1></div>
                <Dialog
                    open={this.state.newLocationOpen}
                    // keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title">{"Adding a new review!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                                <form onSubmit={this.newLocationSubmitHandler}>
                                <p><TextField
                                    id="standard-name"
                                    label="Location name"
                                    name="newName"
                                    // className={classes.textField}
                                    value={this.state.newName}
                                    onChange={this.newLocationFormHandler}
                                    margin="normal"
                                /></p>
                                <p><TextField
                                    id="standard-review"
                                    label="Your review"
                                    name="newReviewBody"
                                    // className={classes.textField}
                                    value={this.state.newReviewBody}
                                    onChange={this.newLocationFormHandler}
                                    margin="normal"
                                /></p>
                                <Button color="primary" type="submit">Ok!</Button>
                            </form>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>


            <Dialog
                open={this.state.newReviewOpen}
                // keepMounted
                onClose={this.handleReviewClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle id="alert-dialog-slide-title">{`Viewing reviews for ${this.state.locationName}`}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {this.getReviews()}
                    <form onSubmit={this.newReviewSubmitHandler}>
                    <p><TextField
                        id="standard-review"
                        label="Your review"
                        name="newReviewBody"
                        // className={classes.textField}
                        value={this.state.newReviewBody}
                        onChange={this.newLocationFormHandler}
                        margin="normal"
                    /></p>
                    <Button color="primary" type="submit">Ok!</Button>
                    </form>
                </DialogContentText>
                </DialogContent>
            </Dialog>



            </>
        )
    }
}


export default MapPage;