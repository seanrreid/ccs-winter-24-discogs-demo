'use strict';

document.addEventListener('DOMContentLoaded', function () {
    console.log('CONTENT LOADED');
    const greeting = document.createElement('h1');
    const root = document.querySelector('#root');

    greeting.textContent = 'Hello World';
    root.append(greeting);

    fetch('https://api.discogs.com/artists/52835', {
        method: 'GET',
        headers: {
            'User-Agent': 'SeanIsRad/3.0',
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Now that I have data, I can throw it into a callback
            showArtist(data);
            return data;
        });

    function showArtist(data) {
        const paragraph = document.createElement('p');
        paragraph.textContent = data.name;
        root.appendChild(paragraph);
    }
});
