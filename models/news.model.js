const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    headline: String,
    blurb: String,
    dateAdded: String
});

const News = mongoose.model('News', newsSchema);

module.exports = News;