const express = require('express');
const router = express.Router();
const Pet = require('../models/pet.model');
router.use(express.json());


router.get('/:terms', (req, res, next) => {
    const searchString = req.params.terms;
    let searchTerms = [...new Set(searchString.split(' '))]
    
    let genderTerm = ''
    if (searchTerms.includes('male')) {
        genderTerm = 'Male'
    }
    else if (searchTerms.includes('female')) {
        genderTerm = 'Female'
    }
    
    if (searchTerms.includes('children')) {searchTerms.push('kids')}
    const removeThese = ['and', 'with', 'a', 'the', 'in', 'an', 'are', 'at', 'all'];
    searchTerms = searchTerms.filter(item => !removeThese.includes(item))

    const regexTerm = new RegExp(searchTerms.join('|'), 'i')
    
    Pet.find({ $or: [
        { petName: {$regex: regexTerm} },
        { type: {$regex: regexTerm} },
        { breed: {$regex: regexTerm} },
        { gender: {$eq: genderTerm}},
        { age: {$regex: regexTerm} },
        { disposition: {$regex: regexTerm} },
        { availability: {$regex: regexTerm} },
        { description: {$regex: regexTerm} }
    ] }).sort({dateAdded: -1})
    .exec((err, pets) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.status(200).send(pets);
    })
})

module.exports = router;