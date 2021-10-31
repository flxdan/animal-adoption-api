require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var whitelist = ["http://localhost:3000", 'https://scary-vault-59712.herokuapp.com']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.urlencoded({ extended: true }));

const exampleRouter = require("./routes/exampleRoutes")
const authRouter = require("./routes/authRoutes")

const db = require("./models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => {
    console.log("Connected to MongoDB.");
    initialize();
  })
  .catch(error => {
    console.error("Error connection to MongoDB", error);
    process.exit();
});

function initialize() {
    Role.collection.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to roles collection");
        });
      }
    });
}

app.use("/api/auth", authRouter)
app.use('/api/test', exampleRouter)

const petRoutes = require('./controllers/pet.controller')
app.use('/pets', petRoutes)
const imgRoutes = require('./controllers/image.controller')
app.use('/images', imgRoutes)


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

