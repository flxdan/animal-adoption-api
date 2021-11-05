const express = require('express');
const router = express.Router();
const Image = require('../models/image.model');
router.use(express.json());


// CONTROLLER FUNCTIONS
router.post('/', (req, res) => {
    const new_img = new Image({pet_id: req.body.pet_id, imgData: req.body.file});
    new_img.save((err, img) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(201).send(img.id)
    })
});

router.get('/:id', (req, res) => {
    Image.findById(req.params.id, (err, img) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!img) {
            res.status(404).send({ message: 'Image Not Found'});
        }
        res.status(200).send(img);
    })
})

router.get('/', (req, res) => {
    Image.find({}, (err, imgs) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(imgs);
})

router.delete('/:id', (req, res) => {
    Image.findByIdAndRemove(req.params.id, (err, img) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(204).end()
    })
})

router.put('/:id', (req, res) => {
    Image.findByIdAndUpdate(req.params.id, {pet_id: req.body.pet_id, imgData: req.body.file}, (err, img) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(img)
    })
})

module.exports = router;