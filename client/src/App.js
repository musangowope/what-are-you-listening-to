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
            hasToken: !!params.access_token,
            nowPlaying: {
                trackName: '',
                artistName: '',
                image: HeadphoneImg,
                rating: ''
            },
            profile: {
                fullName: '',
                profilePicture: '',
                followers: '',
                email: ''
            },
            demoTab: "listen",
            tracks: []

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
        if(this.state.hasToken) {
            spotifyWebApi.getMyCurrentPlaybackState()
                .then((response) => {
                    let isPlayingSomething = response !== ""
                    this.setState({
                        nowPlaying: {
                            trackName: isPlayingSomething ? response.item.name : "No track Playing",
                            artistName: isPlayingSomething ? response.item.artists[0].name : "",
                            image: isPlayingSomething ? response.item.album.images[0].url : "",
                            popularity: isPlayingSomething ? response.item.popularity : ""
                        }
                    })
                })
        }
    }

    goToDemo(demo) {
        if(this.state.hasToken) {
            this.setState({
                demoTab: demo
            })
            if (demo === "profile") {
                this.getUserInformation();
            }
        } else {
            alert("Yes, I used a tacky alert.. But please login to push the other buttons")
        }

    }

    getUserInformation() {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + this.getHashParam().access_token
            }
        };
        axios.get('https://api.spotify.com/v1/me',config)
            .then(res => {
                console.log(res);
                this.setState({
                    profile: {
                        fullName: res.data.display_name,
                        profilePicture: res.data.images[0].url,
                        followers: res.data.followers.total,
                        email: res.data.email
                    }
                })
            });
    }

    // setUserInformation() {
    //     let user = this.getUserInformation();
    //     console.log('user', user)
    //
    // }

    searchTrack() {
        const q = this.refs.startTrackInputRef.value
        console.log(q);
        let config = {
            headers: {
                'Authorization': 'Bearer ' + this.getHashParam().access_token
            }
        };
        axios.get('https://api.spotify.com/v1/search?q='+ q + '&type=track&limit=5',config)
            .then(res => {
                console.log(res.data.tracks.items);
                this.setState({
                    tracks: res.data.tracks.items,
                    //     {
                    //     name: res.data.tracks.items[0].name,
                    //     // artists: res.data.tracks.items[0].artists,
                    //     trackImage: res.data.tracks.items[0].album.images[0].url
                    // }
                })
            });
    }

    /*I know I know, this could've all been componentized*/

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
                            <button onClick={() => this.goToDemo('search')} className="tutorial-btn ripple">
                                <h2 className='uppercase text-white'>
                                    Search Track Demo
                                </h2>
                            </button>
                        </div>
                    </div>

                    <div className={`playlist-background flex-container animated fadeInLeft ${this.state.demoTab === 'listen' ? 'show-demo' : 'hide-demo'}`}
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

                    <section className={`flex-container profile-section ${this.state.demoTab === 'profile' ? 'show-demo' : 'hide-demo'}`}>
                        <div className="animated fadeInLeft">
                            <div className="profile-picture"
                                 style={{backgroundImage: 'url('+ this.state.profile.profilePicture +')'}}
                            />
                            <h3 className="text-white">
                                <strong>Full Name:</strong> { this.state.profile.fullName }</h3>
                            <h3 className="text-white"><strong>Email Address:</strong> { this.state.profile.email} </h3>
                        </div>
                    </section>


                    <section className={`flex-container search-section ${this.state.demoTab === 'search' ? 'show-demo' : 'hide-demo'}`}>
                        <div className="animated fadeInLeft">
                            <h3 className="text-white">Type a track name</h3>
                            <input className="search-track-input" ref="startTrackInputRef"/>
                            <button className="tutorial-btn ripple text-white" onClick={() => this.searchTrack()}>Search Track</button>
                            <div className="track-card-container">
                                {this.state.tracks.map((track, index) => (
                                    <div className='track-card animated fadeIn'>
                                        {/*<div className="track-card-header" />*/}
                                        <div className="track-card-header" style={{backgroundImage: 'url('+ track.album.images[0].url +')'}}/>
                                        <div className="track-card-content">
                                            <h2>Track Name: {track.name}</h2>
                                            {/*<h2>Artist(s):</h2>*/}
                                            <h2>Popularity:</h2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        );
  }
}

export default App;
