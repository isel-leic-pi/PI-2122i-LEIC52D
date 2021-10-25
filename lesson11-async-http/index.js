'use strict'

const lastfm = require('./lastfm')

lastfm
    .getTopTracks('muse')
    .then(arr => console.log(arr.slice(0,5)))

lastfm
    .getTopArtists('australia')
    .then(arr => console.log(arr.slice(0,5)))


