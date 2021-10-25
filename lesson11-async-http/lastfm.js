'use strict'

const fetch = require('node-fetch')


module.exports = {
    getTopTracks,
    getTopArtists
}

const LASTFM_HOST = 'http://ws.audioscrobbler.com/2.0/'
const LASTFM_KEY = process.env.LASTFM_KEY
const LASTFM_TOP_TRACKS = `?method=artist.gettoptracks&format=json&api_key=${LASTFM_KEY}&artist=`
const LASTFM_TOP_ARTISTS = `?method=geo.gettopartists&format=json&api_key=${LASTFM_KEY}&country=`

if(!LASTFM_KEY) throw Error('Last.fm Key not set!')

/**
 * @param {String} artist Name of the band or artist.
 * @returns {Promise.<Array>} Promise of an array with tracks names or Error if not succeeded
 */
function getTopTracks(artist) {
    const path = LASTFM_HOST + LASTFM_TOP_TRACKS + artist
    return fetch(path)
        .then(res => res.json())
        .then(obj => obj.toptracks.track.map(t => t.name))
}
/**
 * @param {String} country Name of a countr
 * @returns {Promise.Array} With names of the top artists
 */
function getTopArtists(country) {
    const path = LASTFM_HOST + LASTFM_TOP_ARTISTS + country
    return fetch(path)
        .then(res => res.text())
        .then(body => JSON.parse(body))
        .then(obj => obj
            .topartists
            .artist
            .map(t => t.name))
}
/**
 * Given a coutry get the top artists and for the first one
 * return its top tracks.
 * 
 * @param {String} country 
 */
function tracksOfTopArtist(country) {
    
}