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
router.post('/', (req, res) => {
    if (Object.keys(req.body).length != 9) {
        res.status(400).json({'Error' : 'Missing Attributes'})
    }
    else {
        const new_pet = create_pet(req.body);
        new_pet.save((err, pet) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.status(201).send(pet)
        })
    }
});

router.get('/:id', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
        if (err) {
            res.status(500).send({message: err});
            return
        }
        if (!pet) {
            res.status(404).send({ message: 'Pet Not Found' });
            return;
        }
        res.status(200).send(pet);
    });
})

router.get('/', (req, res) => {
    Pet.find({}, (err, pets) => {
        if (err) {
            res.status(500).send({ messge: err });
            return
        }
        res.status(200).send(pets)
    })
})

router.delete('/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id, (err, pet) => {
        if (err) {
            res.status(500).send({ messge: err });
            return
        }
        Image.deleteMany({ pet_id: req.params.id }, (err, imgs) => {
            if (err) {
                res.status(500).send({messge: err});
                return
            }
            res.status(204).end()
        })
    })
})

router.put('/:id', (req, res) => {
    if (Object.keys(req.body).length != 9) {
        res.status(400).json({'Error' : 'Missing Attributes'})
    }
    else {
        const new_pet = update_pet(req.body);
        Pet.findByIdAndUpdate(req.params.id, new_pet, (err, pet) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!pet) {
                res.status(404).send({ message: 'Pet Not Found' });
                return;
            }
            res.status(200).send(pet)
        })
    }
})

router.get('/:id/images', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
        if (err) {
            res.status(500).send({message: err});
            return
        }
        if (!pet) {
            res.status(404).send({ message: 'Pet Not Found' });
            return;
        }
        Image.find({ pet_id: {$in: req.params.id} }, (err, imgs) => {
            if (err) {
                res.status(500).send({message: err});
                return
            }
            res.status(200).send(imgs)
        })
    })
})

module.exports = router;