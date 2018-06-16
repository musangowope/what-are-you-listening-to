import React, { Component } from 'react';
import './App.css';
import HeadphoneImg from './assets/images/listening-to-music-bg.jpg'
import Spotify from 'spotify-web-api-js';


/*Because its a class then we have to instantiate it */
const spotifyWebApi = new Spotify();

class App extends Component {
    constructor() {
        super();
        /*Getting params from URL*/
        const params = this.getHashParam();
        this.state = {
            params: params,
            moodBgColor: '#9c6e7f',
            /*if access token is true that logged in state*/
            loggedIn: !!params.access_token,
            nowPlaying: {
                trackName: '',
                artistName: '',
                image: HeadphoneImg,
                rating: ''
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

    componentWillMount() {
        this.getNowPlaying();
        this.changeMoodBgColor = setInterval(() => this.getRandomColor(), 10000)
    }

    componentWillUnmount() {
        clearInterval(this.changeMoodBgColor)
    }

    getRandomColor() {
        let length = 6;
        let chars = '0123456789ABCDEF';
        let hex = '#';
        while(length--) hex += chars[(Math.random() * 16) | 0];
        this.setState({
            moodBgColor: hex
        })
    }

    getNowPlaying() {
        if(this.state.loggedIn) {
            spotifyWebApi.getMyCurrentPlaybackState()
                .then((response) => {
                    let isPlayingSomething = response !== ""
                    this.setState({
                        nowPlaying: {
                            trackName: isPlayingSomething ? response.item.name : "No track Playing",
                            artistName: isPlayingSomething ? response.item.artists[0].name : "",
                            image: isPlayingSomething ? response.item.album.images[1].url : "",
                            popularity: isPlayingSomething ? response.item.popularity : ""
                        }
                    })
                })
        }
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: this.state.moodBgColor}}>
                <div className="shadow-overlay"></div>
                <div className="on-top">
                    <div className='playlist-background'
                         style={{backgroundImage: 'url('+ this.state.nowPlaying.image +')'}}>
                        {this.state.params.access_token && (
                            <div>
                                <div className="track-artist-container">
                                    <h2 className="text-white">
                                        Track Currently Playing: {this.state.nowPlaying.trackName}
                                    </h2>
                                    <h3 className="text-white">{this.state.nowPlaying.artistName}</h3>
                                </div>
                                <div className="rating">
                                    <h3 className="text-white">Popularity: {this.state.nowPlaying.popularity}</h3>
                                    <div className="rating-circle"></div>
                                </div>

                                <button className="check-song-button" onClick={() => this.getNowPlaying() }>
                                    Check Song Now Playing
                                </button>

                            </div>
                        )}

                        {!this.state.params.access_token && (
                            <a className="login-link" href="http://localhost:8888">
                                <strong>
                                    <h1>Login with Spotify</h1>
                                </strong>
                            </a>
                        )}

                    </div>
                </div>
            </div>
        );
  }
}

export default App;
