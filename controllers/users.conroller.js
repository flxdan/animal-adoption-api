const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
userRouter.use(express.json());

const updateFavorites = async (user, pet, id) => {
    delete user.accessToken;
    delete user.authorities
    var userData = await User.findOne({username: user.username}).populate('favorites');

    if (userData.favorites === undefined) {
        let new_array = []
        new_array.concat(pet)
        user.favorites = [...new_array]
    } else {
        userData.favorites.push(pet);
        user.favorites = [...userData.favorites]
    } 

    return user
}

const removeFavorite = async (user, petID) => {
    delete user.accessToken;
    delete user.authorities
    var userData = await User.findOne({username: user.username}).populate('favorites');
    console.log(petID)
    console.log("--")
    let newArray = userData.favorites.filter((entry) => entry.petName != petID);
    
    console.log("--")
    console.log(newArray)
    user.favorites = [...newArray]

    return user
}

userRouter.put('/:id/favorites', async (req, res) => {
    let user = req.body.user
    let pet = req.body.pet
    var updatedUser = await updateFavorites(user, pet, req.params.id);

    User.findByIdAndUpdate(req.params.id, updatedUser, (err, user) => {
            if (err) {
                console.log(err)
                res.status(500).send({'Error': err});
            }
            res.status(201).json(user)
    })  
})

userRouter.get('/:id/favorites', (req, res) => {

    User.findById(req.params.id, 'favorites').populate('favorites').exec(function (err, favs) {
        if (err) {
            console.log(err)
            res.status(500).send({ "Error": err });
        }
        res.status(200).send(favs)
    });

})

userRouter.patch('/:id/favorites', async (req, res) => {
    let user = req.body.user
    let petID = req.body.petId

    var updatedUser = await removeFavorite(user, petID);

    User.findByIdAndUpdate(req.params.id, updatedUser, (err, user) => {
            if (err) {
                console.log(err)
                res.status(500).send({'Error': err});
            }
            res.status(201).end()
    })  
})

module.exports = userRouter;