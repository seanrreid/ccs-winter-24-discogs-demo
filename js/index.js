'use strict';

document.addEventListener('DOMContentLoaded', function () {
    console.log('CONTENT LOADED');
    const root = document.querySelector('#root');
    const wrapper = document.createElement('div');
    root.appendChild(wrapper);
    let songsForPlaylist = [];

    generatePlaylistDownloadButton();

    function get(url) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'SeanIsRad/3.0',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return data;
            });
    }

    function showArtist(artistName) {
        const artistHeader = document.createElement('h2');
        artistHeader.textContent = artistName;
        wrapper.appendChild(artistHeader);
    }

    function getReleases(url) {
        get(url).then(function (data) {
            // Destructure the releases
            const { releases } = data;

            // Create  UL
            const list = document.createElement('ul');
            // Append it to the #root
            wrapper.appendChild(list);

            // Loop through the releases array
            releases.map(function (release) {
                const { title, year } = release;
                // Create a list item
                generateListItems(list, title, year);
            });
        });
    }

    function generateListItems(list, title, year) {
        const listItem = document.createElement('li');
        const addToListButton = document.createElement('button');
        addToListButton.type = 'button';
        addToListButton.textContent = 'Add to List';
        // Add the release title to the list item
        listItem.textContent = `${title} -  ${year}`;
        // Add button to generate list
        listItem.appendChild(addToListButton);

        addToListButton.addEventListener('click', function (e) {
            songsForPlaylist = [...songsForPlaylist, title];
            populatePlaylist(songsForPlaylist);
        });

        // Append the lisi item to the list
        list.appendChild(listItem);
    }

    function populatePlaylist(songs) {
        const playlistEl = document.querySelector('#playlist');

        if (!playlistEl) {
            const newPlaylistEl = document.createElement('div');
            newPlaylistEl.id = 'playlist';
            root.appendChild(newPlaylistEl);

            songs.map((song) => {
                const songItem = document.createElement('p');
                songItem.textContent = song;
                newPlaylistEl.appendChild(songItem);
            });
        } else {
            let song = songs[0];

            if (songs.length >= 1) {
                song = songs[songs.length - 1];
            }

            const songItem = document.createElement('p');
            songItem.textContent = song;
            playlistEl.appendChild(songItem);
        }
    }

    // Lines 97 - 130, and the createPlaylist() function are bonus items
    function generatePlaylistDownloadButton() {
        const generateButton = document.createElement('button');
        generateButton.textContent = 'Download M3U file';
        generateButton.id = 'Download Button';
        wrapper.appendChild(generateButton);

        generateButton.addEventListener('click', function (e) {
            console.log('WHAT ARE THE SONGS?', songsForPlaylist);
            if (songsForPlaylist.length <= 0) {
                alert('Add some songs first!');
            } else {
                downloadPlaylistLink(songsForPlaylist);
            }
        });
    }

    function downloadPlaylistLink(songsArray) {
        const timestamp = new Date().getTime();
        // Convert milliseconds to seconds (divide by 1000) to get the timestamp in seconds
        const timestampInSeconds = Math.floor(timestamp / 1000);

        const playlistContent = createPlaylist(songsArray);
        const blob = new Blob([playlistContent], {
            type: 'application/x-mpegURL',
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.textContent = 'Click to download playlist';
        a.download = `myPlaylist-${timestampInSeconds}.m3u`;
        a.click();
    }

    // This is an Immediately Invoked Function Expression aka IIFE (iffy)
    (function () {
        get('https://api.discogs.com/artists/1966143').then(function (data) {
            // Destructure our data
            const { name, releases_url } = data;
            // Call it back
            showArtist(name);
            getReleases(releases_url);
        });
    })();
});

function createPlaylist(songsArray) {
    let m3uFile = '#EXTM3U\n';

    songsArray.map((song, index) => {
        console.log('SONG:', song);
        const trackNumber = index + 1;
        m3uFile += `#EXTINF:${trackNumber},${song}\n`;
        // If we had the file or a URL we would replace
        // this next line with the file path or URL
        m3uFile += `${song}.mp3\n`;
    });

    return m3uFile;
}
