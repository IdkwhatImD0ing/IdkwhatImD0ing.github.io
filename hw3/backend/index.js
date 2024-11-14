const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const mongoose = require('mongoose')
const Favorite = require('./models/favorite')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

const cache = new Map()
const mongoURI =
  'mongodb+srv://jzhang71:OAON2HiZfFgnnIWt@cluster0.bsdx4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection

db.on('error', (error) => console.error('MongoDB connection error:', error))
db.once('open', () => console.log('Connected to MongoDB Atlas'))

app.get('/', (req, res) => {
  res.send('<p>Hello, World!</p>')
})

app.get('/get_weather', async (req, res) => {
  try {
    const {latitude, longitude, startTime, endTime} = req.query
    console.log(req.query)

    const cacheKey = `${latitude}-${longitude}-${startTime}-${endTime}`
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey))
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        error:
          'Both latitude (lat) and longitude (lon) parameters are required.',
      })
    }

    const fields = [
      'temperature',
      'temperatureApparent',
      'temperatureMin',
      'temperatureMax',
      'windSpeed',
      'windDirection',
      'humidity',
      'pressureSeaLevel',
      'uvIndex',
      'weatherCode',
      'precipitationProbability',
      'precipitationType',
      'sunriseTime',
      'sunsetTime',
      'visibility',
      'moonPhase',
      'cloudCover',
    ]

    const params = {
      apikey: '2kx6qbSm5Iz5XGiUlYKUj9rXnyVyQq35',
      fields,
      timesteps: ['1h', '1d'],
      units: 'imperial',
      timezone: 'America/New_York',
      location: `${latitude},${longitude}`,
    }

    if (startTime && endTime) {
      params.startTime = startTime
      params.endTime = endTime
    }

    console.log(startTime)
    console.log(endTime)
    console.log(params)

    const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
      params,
    })

    if (response.status === 200) {
      cache.set(cacheKey, response.data.data)
      return res.json(response.data.data)
    } else {
      console.log(response.data)
      return res.status(500).json({error: 'Failed to fetch weather data.'})
    }
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
})

app.get('/favorites/check', async (req, res) => {
  const {uuid, city, state} = req.query

  if (!uuid || !city || !state) {
    return res
      .status(400)
      .json({error: 'Missing uuid, city, or state query parameters.'})
  }

  try {
    const favorite = await Favorite.findOne({uuid, city, state})
    if (favorite) {
      return res.json({isFavorite: true, favorite})
    } else {
      return res.json({isFavorite: false})
    }
  } catch (error) {
    console.error('Error checking favorite:', error)
    return res.status(500).json({error: 'Internal server error.'})
  }
})

app.post('/favorites/add', async (req, res) => {
  const {uuid, city, state, longitude, latitude} = req.body

  if (
    !uuid ||
    !city ||
    !state ||
    longitude === undefined ||
    latitude === undefined
  ) {
    return res.status(400).json({
      error: 'Missing required fields: uuid, city, state, longitude, latitude.',
    })
  }

  try {
    const newFavorite = new Favorite({uuid, city, state, longitude, latitude})
    await newFavorite.save()
    return res
      .status(201)
      .json({message: 'Favorite added successfully.', favorite: newFavorite})
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({error: 'This city/state is already a favorite.'})
    }
    console.error('Error adding favorite:', error)
    return res.status(500).json({error: 'Internal server error.'})
  }
})

app.delete('/favorites/remove', async (req, res) => {
  const {uuid, city, state} = req.body

  if (!uuid || !city || !state) {
    return res
      .status(400)
      .json({error: 'Missing uuid, city, or state in request body.'})
  }

  try {
    const deletedFavorite = await Favorite.findOneAndDelete({uuid, city, state})
    if (deletedFavorite) {
      return res.json({
        message: 'Favorite removed successfully.',
        favorite: deletedFavorite,
      })
    } else {
      return res.status(404).json({error: 'Favorite not found.'})
    }
  } catch (error) {
    console.error('Error removing favorite:', error)
    return res.status(500).json({error: 'Internal server error.'})
  }
})

app.get('/favorites', async (req, res) => {
  const {uuid} = req.query

  if (!uuid) {
    return res.status(400).json({error: 'Missing uuid query parameter.'})
  }

  try {
    const favorites = await Favorite.find({uuid})
    return res.json({favorites})
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return res.status(500).json({error: 'Internal server error.'})
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
