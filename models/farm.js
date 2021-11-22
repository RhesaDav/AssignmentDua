const mongoose = require('mongoose')
const { Schema } = mongoose;

const farmSchema = new Schema ({
    namaFarm: String
})

const farm = mongoose.model('farm', farmSchema)

module.exports = farm