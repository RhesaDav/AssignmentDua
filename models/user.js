const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema ({
    nama: String,
    email: String,
    password: String,
    townhall: {
        resource: {
            medal: {type: Number, default : 0, min: 0, max: 1000},
            gold: {type: Number, default : 100, min: 0, max: 1000},
            food: {type: Number, default : 100, min: 0, max: 1000 },
            soldier: {type: Number, default : 10, min: 0}
        },
        barrack: [{ type: Schema.Types.ObjectId, ref: "barrack" }],
        market: [{ type: Schema.Types.ObjectId, ref: 'market'}],
        farm: [{ type: Schema.Types.ObjectId, ref: 'farm'}]
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;  