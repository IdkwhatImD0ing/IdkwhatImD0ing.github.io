const mongoose = require('mongoose')

const FavoriteSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
})

FavoriteSchema.index({uuid: 1, city: 1, state: 1}, {unique: true})

module.exports = mongoose.model('Favorite', FavoriteSchema)
