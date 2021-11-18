const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    petName: String,
    type: String,
    breed: String,
    gender: String,
    age: String,
    disposition: Array,
    fixed: Boolean,
    availability: String,
    description: String,
    dateAdded: String
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;