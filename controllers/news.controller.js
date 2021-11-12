const express = require('express');
const router = express.Router();
const News = require('../models/news.model');
router.use(express.json());

const create_news_item=(body) => {
    const{headline, blurb, dateAdded} = body;
    const new_blurb = new News({
        headline: headline,
        blurb: blurb,
        dateAdded: dateAdded
    });
    return new_blurb
}

router.get('/', (req, res) => {
    News.find({}).exec((err, news) => {
        if (err) {
            res.status(500).send({ messge: err });
            return
        }
        res.status(200).send(news)
    });
})

router.post('/', (req, res) => {
    if (Object.keys(req.body).length != 3){
        res.status(400).json({'Error' : 'Missions Attributes'})
    }
    else {
        const new_blurb = create_news_item(req.body);
        new_blurb.save((err, news) =>{
            if(err) {
                res.status(500).send({message: err});
            }
            res.status(201).send(news)
        })
    }
});

module.exports = router;