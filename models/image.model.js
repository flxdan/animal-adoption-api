const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    pet_id: String,
    imgData: String
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;