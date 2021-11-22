const mongoose = require('mongoose');
const { Schema } = mongoose;

const marketSchema = new Schema ({
    namaMarket: 'string'
})

const market = mongoose.model('market', marketSchema);

module.exports = market;