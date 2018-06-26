import React, { Component } from 'react';
import './App.css';
import HeadphoneImg from './assets/images/listening-to-music-bg.jpg'
import Spotify from 'spotify-web-api-js';
import axios from 'axios'


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
            },
            demoTab: "listen"
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

    goToDemo(demo) {
        this.setState({
            demoTab: demo
        })
    }

    getUserInformation() {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + this.getHashParam().access_token
            }
        }
        axios.get('https://api.spotify.com/v1/me',config)
            .then(function(response){
                console.log(response.data); // ex.: { user: 'Your User'}
                console.log(response.status); // ex.: 200
            });
    }

    render() {
        return (
            <div className="App" style={{backgroundColor: this.state.moodBgColor}}>
                <div className="shadow-overlay"></div>
                <div className="on-top">
                    <div className='flex-container navbar uppercase'>
                        <div className='flex-item'>
                            <button onClick={() => this.goToDemo('listen')} className="tutorial-btn ripple">
                                <h2 className="uppercase text-white">What are you listening to demo</h2>
                            </button>
                        </div>
                        <div className='flex-item'>
                            <button onClick={() => this.goToDemo('profile')} className="tutorial-btn ripple">
                                <h2 className="uppercase text-white">
                                    Get Profile Details Demo
                                </h2>
                            </button>
                        </div>
                        <div className='flex-item'>
                            <button onClick={() => this.goToDemo('profile')} className="tutorial-btn ripple">
                                <h2 className='uppercase text-white'>
                                    Search Track Demo
                                </h2>
                            </button>
                        </div>
                    </div>

                    <div className={`playlist-background flex-container ${this.state.demoTab === 'listen' ? 'show-demo' : 'hide-demo'}`}
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

                    <div className={`flex-container ${this.state.demoTab === 'profile' ? 'show-demo' : 'hide-demo'}`}>
                        <button onClick={() => this.getUserInformation()}>Get Profile Data</button>
                    </div>

                    <div className={`flex-container ${this.state.demoTab === 'search' ? 'show-demo' : 'hide-demo'}`}>
                        <h2>Search Track Demo</h2>
                    </div>

                </div>
            </div>
        );
  }
}

export default App;
