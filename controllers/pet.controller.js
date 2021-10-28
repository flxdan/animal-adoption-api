const express = require('express');
const router = express.Router();
const Pet = require('../models/pet.model');
const Image = require('../models/image.model');
router.use(express.json());

// HELPER FUNCTIONS
const create_pet = (body) => {
    const {petName, type, breed, age, disposition, fixed, availability, description, dateAdded} = body;
    const new_pet = new Pet({
        petName: petName,
        type: type,
        breed: breed,
        age: age,
        disposition: disposition,
        fixed: fixed,
        availability: availability,
        description: description,
        dateAdded: dateAdded 
    });
    return new_pet
}

const update_pet = (body) => {
    const {petName, type, breed, age, disposition, fixed, availability, description, dateAdded} = body;
    const new_pet = {
        petName: petName,
        type: type,
        breed: breed,
        age: age,
        disposition: disposition,
        fixed: fixed,
        availability: availability,
        description: description,
        dateAdded: dateAdded 
    };
    return new_pet
}

// CONTROLLER FUNCTIONS
router.post('/', (req, res, next) => {
    if (Object.keys(req.body).length != 9) {
        res.status(400).json({'Error' : 'Missing Attributes'})
    }
    else {
        const new_pet = create_pet(req.body);
        new_pet.save().then(result => {
            res.status(201).send(result);
        })
    }
});

router.get('/:id', (req, res, next) => {
    Pet.findById(req.params.id)
        .then(this_pet => {
            if (this_pet){
                res.status(200).send(this_pet);
            }
            else {
                res.status(400).json({'Error' : 'No pet with this id'})
            }
        })
})

router.get('/', (req, res, next) => {
    Pet.find({}).then(result => {
        res.status(200).json(result);
      })
})

router.delete('/:id', (req, res, next) => {
    Pet.findByIdAndRemove(req.params.id)
        .then(result => {
            Image.deleteMany({ pet_id: req.params.id })
                .then(res.status(204).end())
        })
        .catch(error => next(error))
})

router.put('/:id', (req, res, next) => {
    if (Object.keys(req.body).length != 9) {
        res.status(400).json({'Error' : 'Missing Attributes'})
    }
    else {
        const new_pet = update_pet(req.body);
        Pet.findByIdAndUpdate(req.params.id, new_pet)
            .then(this_pet => {
                res.status(200).json(this_pet)
            })
            .catch(error => next(error))
    }
})

router.get('/:id/images', (req, res, next) => {
    Pet.findById(req.params.id)
        .then(this_pet => {
        if (!this_pet){
            res.status(400).json({'Error' : 'No pet with this id'});
        }
        else {
            Image.find({pet_id: {$in: req.params.id}}).then(images => {
                res.status(200).send(images)
            })
        }
    })
})

module.exports = router;