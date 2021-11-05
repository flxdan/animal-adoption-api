const express = require('express');
const router = express.Router();
const Pet = require('../models/pet.model');
router.use(express.json());


router.get('/:terms', (req, res, next) => {
    const searchString = req.params.terms;

    let searchTerms = [...new Set(searchString.split(" "))]
    const removeThese = ["and", "with", "a", "the", 'in', 'an', 'are', 'at', 'other', 'all'];
    searchTerms = searchTerms.filter(item => !removeThese.includes(item))
    
    const regexTerm = new RegExp(searchTerms.join("|"), 'i')
    
    Pet.find({ $or: [
        { petName: {$regex: regexTerm} },
        { type: {$regex: regexTerm} },
        { breed: {$regex: regexTerm} },
        { age: {$regex: regexTerm} },
        { disposition: {$regex: regexTerm} },
        { availability: {$regex: regexTerm} },
        { description: {$regex: regexTerm} }
    ] }, (err, pets) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.status(200).send(pets);
    })
})

module.exports = router;