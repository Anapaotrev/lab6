const request = require('request')

if (process.env.NODE_ENV === 'production') {
    var darkSkyApiKey = process.env.DARKSKY_APIKEY
    var mapBoxApiKey = process.env.MAPBOX_APIKEY
} else {
    const credentials = require('./credentials.js')
    var darkSkyApiKey = credentials.darkSkyApiKey
    var mapBoxApiKey = credentials.mapBoxApiKey
}

const getWeather = function(coordinates, callback) {
    const url = 'https://api.darksky.net/forecast/' + darkSkyApiKey + '/' 
                + coordinates.lat + ',' + coordinates.long + '?lang=es&units=si'

    request({ url, json: true }, function(error, response) {
        if (error) {
            callback('Not Found', undefined)
        } else {
            const data = response.body

            if (data.error) {
                callback(data.error, undefined)
            } else {
                const weather = {
                    summary: data.hourly.summary,
                    temperature: data.currently.temperature,
                    apparentTemperature: data.currently.apparentTemperature,
                    rain: data.currently.precipProbability
                }

                callback(undefined, weather)
            }
        }
    })
}

const getGeocode = function(city, callback) {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' 
                 + city + '.json?access_token=' + mapBoxApiKey

    request({ url, json: true }, function(error, response) {
        if (error) {
            callback('Not Found', undefined)
        } else {
            const data = response.body
            
            if (data.message) {
                callback(data.message, undefined)
            } else if (data.features.length == 0) {
                callback("Incorrect", undefined)
            } else {
                const geometry = data.features[0].geometry
                const coordinates = {
                    long: geometry.coordinates[0],
                    lat: geometry.coordinates[1]
                }
                callback(undefined, coordinates)
            }
        }
    })
}

module.exports = {
    getGeocode: getGeocode,
    getWeather: getWeather
}
