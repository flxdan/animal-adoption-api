const express = require('express');
const router = express.Router();
const Image = require('../models/image.model');
router.use(express.json());


// CONTROLLER FUNCTIONS
router.post('/', (req, res, next) => {
    const new_img = new Image({pet_id: req.body.pet_id, imgData: req.body.file});
    new_img.save().then(result => {
            res.status(201).send(result.id);
    })
});

router.get('/:id', (req, res, next) => {
    Image.findById(req.params.id)
        .then(this_img => {
            if (this_img){
                res.status(200).send(this_img);
            }
            else {
                res.status(400).json({'Error' : 'No image with this id'})
            }
        })
})

router.get('/', (req, res, next) => {
    Image.find({}).then(result => {
        res.status(200).json(result);
      })
})

router.delete('/:id', (req, res, next) => {
    Image.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

router.put('/:id', (req, res, next) => {
    Image.findByIdAndUpdate(req.params.id, {pet_id: req.body.pet_id, imgData: req.body.file})
        .then(this_image => {
            res.status(200).json(this_image)
        })
        .catch(error => next(error))
})

module.exports = router;
