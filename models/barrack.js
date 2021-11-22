const mongoose = require('mongoose');
const { Schema } = mongoose;

const barrackSchema = new Schema ({
    namaBarrack: String,
    soldier: {type : Number, default : 0}
})

const barrack = mongoose.model('barrack', barrackSchema);

module.exports = barrack