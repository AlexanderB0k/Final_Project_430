const models = require('../models');
const Rating = models.Rating;

const makeRating = async (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Name and age are required' });
    }

    const ratingData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
    };

    try {
        const newRating = new Rating (ratingData);
        await newRating.save();
        return res.status(201).json({name: newRating.name, age: newRating.age});
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Rating with that name already exists' });
        }
        return res.status(500).json({ error: 'Error creating rating' });
    }
};

const makerPage = (req, res) => {
    res.render('app');
};

const getRatings = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Rating.find(query).select('name age').lean().exec();
        return res.json({ ratings: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching ratings' });
    }
};

module.exports = {
    makerPage,
    makeRating,
    getRatings,
};