const express = require('express')
const app = express()
const climate = require('./climate.js')

const port = process.env.PORT || 3000

app.get('/weather', function(req, res) {
    if (!req.query.search) {
        res.send({
            error: 'Debes enviar una ciudad'
        })
    } else {
        const city = req.query.search
        climate.getGeocode(city, function(error, coordinates) {
            if (error) {
                res.send({
                    error: error
                })
            } else {
                if (coordinates) {
                    climate.getWeather(coordinates, function(error, weather) {
                        if (error) {
                            res.send({
                                error: error
                            })
                        } else {
                            const sentence = weather.summary
                            + ' La temperatura actualmente esta a ' + weather.temperature + 'C '
                            + 'y se siente a ' + weather.apparentTemperature + 'C. '
                            + 'Hay ' + weather.rain + '% de probabilidad de lluvia.'

                            res.send({
                                city: city,
                                summary: weather.summary,
                                temperature: weather.temperature,
                                apparentTemperature: weather.apparentTemperature,
                                rain: weather.rain,
                                sentence: sentence
                            })
                        }
                    })
                } else {
                    res.send('No existen coordenadas')
                }
            }
        })
    }
})

app.get('*', function(req, res) {
    res.send({
        error: 'Oops! Ruta no valida'
    })
})

app.listen(port, function() {
    console.log('up and running!')
})