const express = require('express');
const router = express.Router();
const Pet = require('../models/pet.model');
const Image = require('../models/image.model');
router.use(express.json());


const create_pet = (body) => {
    const {petName, type, breed, gender, age, disposition, fixed, availability, description, dateAdded} = body;
    const new_pet = new Pet({
        petName: petName,
        type: type,
        breed: breed,
        gender: gender,
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
    const {petName, type, breed, gender, age, disposition, fixed, availability, description, dateAdded} = body;
    const new_pet = {
        petName: petName,
        type: type,
        breed: breed,
        gender: gender,
        age: age,
        disposition: disposition,
        fixed: fixed,
        availability: availability,
        description: description,
        dateAdded: dateAdded 
    };
    return new_pet
}


router.post('/', (req, res) => {
    if (Object.keys(req.body).length != 10) {
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
    Pet.find({}).sort({dateAdded: -1})
    .exec((err, pets) => {
        if (err) {
            res.status(500).send({ messge: err });
            return
        }
        res.status(200).send(pets)
    });
})

router.delete('/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id, (err, pet) => {
        if (err) {
            res.status(500).send({ messge: err });
            return
        }
        Image.deleteMany({ pet_id: req.params.id }, (err) => {
            if (err) {
                res.status(500).send({messge: err});
                return
            }
            res.status(204).end()
        })
    })
})

router.put('/:id', (req, res) => {
    if (Object.keys(req.body).length != 10) {
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

router.delete('/:id/images', (req, res) => {
    Pet.findById(req.params.id, (err, pet) => {
        if (err) {
            res.status(500).send({ message: err });
            return
        }
        if (!pet) {
            res.status(404).send({ message: 'Pet Not Found' } )
            return
        }
        Image.deleteMany({ pet_id: req.params.id }, (err) => {
            if (err) {
                res.status(500).send({messge: err});
                return
            }
            res.status(204).end()
        })
    })
})

module.exports = router;