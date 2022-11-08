const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const msgSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    sent: {
        type: Boolean,
        required: false,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Msg', msgSchema);