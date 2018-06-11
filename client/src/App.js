import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';


/*Because its a class then we have to instantiate it */
const spotifyWebApi = new Spotify();

class App extends Component {
    constructor() {
        super();
        /*Getting params from URL*/
        const params = this.getHashParam();
        this.state = {
            /*if access token is true that logged in state*/
            loggedIn: !!params.access_token,
            nowPlaying: {
                name: 'Not Checked',
                image: '',
            }
        }
        /*if there is access token available then we can set the access token within spotify web api
        * Convenient because we dont have to add the acccess token everytime we make a request
        * */
        if(params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token);
        }
    }

    /*Auth Access Token details*/
    getHashParam() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    getNowPlaying() {
        /**/
        spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                console.log(response)
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        image: response.item.album.images[0].url
                    }
                })
            })
    }

    render() {
        return (
            <div className="App">
                <a href="http://localhost:8888">
                    <button>Login with Spotify</button>
                </a>
                <div>Now Playing { this.state.nowPlaying.name }</div>
                <div>
                    <img src={this.state.nowPlaying.image} style={{width: 100}} />
                </div>
                <button onClick={() => this.getNowPlaying() }>
                    Check Now Playing
                </button>
            </div>
        );
  }
}

export default App;
