'use strict';

document.addEventListener('DOMContentLoaded', function () {
    console.log('CONTENT LOADED');
    const greeting = document.createElement('h1');
    const root = document.querySelector('#root');

    greeting.textContent = 'Discogs API Lookup';
    root.append(greeting);

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

    function showArtist(artistNam) {
        const artistHeader = document.createElement('h2');
        artistHeader.textContent = artistNam;
        root.appendChild(artistHeader);
    }

    function getReleases(url) {
        get(url).then(function (data) {
            // Destructure the releases
            const { releases } = data;
            // Create  UL
            const list = document.createElement('ul');
            // Append it to the #root
            root.appendChild(list);

            // Loop through the releases array
            releases.map(function (release) {
                // Create a list item
                const listItem = document.createElement('li');
                // Add the release title to the list item
                listItem.textContent = `${release.title} -  ${release.year}`;
                // Append the lisi item to the list
                list.appendChild(listItem);
            });
        });
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
