import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{name: 'name1', artist: 'artist1', album: 'album1', id: 1},
      {name: 'name2', artist: 'artist2', album: 'album2', id: 2},
      {name: 'name3', artist: 'artist3', album: 'album3', id: 3}
      ], playlistName: 'Peanut Butter and Jamz'
      , playlistTracks: [{name: 'name1', artist: 'artist1', album: 'album1', id: 4},
      {name: 'name2', artist: 'artist2', album: 'album2', id: 5},
      {name: 'name3', artist: 'artist3', album: 'album3', id: 6}
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    // checking to see if track is already in playlist
    if(tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } 
    // if track is not in playlist, this adds track to playlist and sets new state
    tracks.push(track)
    this.setState({playlistTracks: tracks})
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks
    // filtering out track if current track matches a track from tracks array
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    // resetting state to now have track removed from array
    this.setState({ playlistTracks: tracks });
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
