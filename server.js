require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json({limit: '50mb'}));
app.use(cors());

const source = process.env.MONGODB_URI;

mongoose.connect(source)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const petRoutes = require('./controllers/pet.controller')
app.use('/pets', petRoutes)
const imgRoutes = require('./controllers/image.controller')
app.use('/images', imgRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Listening on port: ${PORT}`);
})