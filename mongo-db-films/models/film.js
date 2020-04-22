const mongoose = require ('mongoose');

const filmSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    actor: {
        type: String,
    },
    description: {
        type: String,
    },
    year: {
        type: Number
    },
});

module.exports = mongoose.model('Film', filmSchema);