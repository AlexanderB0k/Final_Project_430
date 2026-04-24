const models = require('../models');
const Rating = models.Rating;

const makeRating = async (req, res) => {
    if (!req.body.name || !req.body.originFood || !req.body.starRating || !req.body.photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const ratingData = {
        name: req.body.name,
        originFood: req.body.originFood,
        starRating: req.body.starRating,
        photo: req.body.photo,
        owner: req.session.account._id,
    };

    try {
        const newRating = new Rating(ratingData);
        await newRating.save();
        return res.status(201).json({ name: newRating.name, originFood: newRating.originFood, starRating: newRating.starRating, photo: newRating.photo });
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
        const docs = await Rating.find(query).select('name originFood starRating photo').lean().exec();
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