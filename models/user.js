const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
      }
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User;