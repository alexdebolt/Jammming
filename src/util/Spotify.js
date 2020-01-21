const clientId = '7290845fe6f8489cb755e5a303b92afe';
const redirectUri = 'http://localhost:3000/';

let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // Clearing parameters from URL so Jammming doesn't try to grab the token after it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    // this method takes a search input and passes the search term to a Spotify request and returns a list in JSON format
    search(term) {
        // calling getAccessToken and saving result to a const accessToken
        const accessToken = Spotify.getAccessToken();
        // returning promise with a header authorization and 
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        {headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            // if search returns no result (ie. you search for 'adlfk') then a blank list is returned
            if(!jsonResponse.tracks) {
                return [];
            }
            // returns a list of track objects set with the following properties
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    // this method allows the user to save their playlist to their account
    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }
        //need access to user's Spotify account so must request token
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        // making request to return user's Spotify username and converting the response to JSON
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            // setting user's id to response from Spotify
            userId = jsonResponse.id;
            // Adds playlist to user's account
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;

                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackURIs })
                })
            })
        })
    }
};



export default Spotify;