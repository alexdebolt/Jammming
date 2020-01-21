import React from 'react';

import './Track.css';

class Track extends React.Component {

    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    // Setting the add track '+' if it has not yet been added and the '-' if it has
    renderAction() {
        // the following is true when Track is in playlist component
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
            // this statement is true when Track is located in search results component
            // calls addTrack when + is clicked to add track from results to playlist
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }
    // adds track to playlist from results
    addTrack() {
        this.props.onAdd(this.props.track);
    }

    // removes tracks from playlist 
    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        return (
            <div className="Track">
              <div className="Track-information">
                <h3>{this.props.track.name}</h3>
                <p>{this.props.track.artist} | {this.props.track.album} </p>
              </div>
              {this.renderAction()}
            </div>
        )
    }
}

export default Track;