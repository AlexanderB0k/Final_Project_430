const models = require('../models');
const FoodPlace = models.foodPlace;

const makerFoodPlace = async (req, res) => {
    if (!req.body.displayName || !req.body.description || !req.body.rating || !req.body.photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const foodPlaceData = {
        displayName: req.body.displayName,
        description: req.body.description,
        rating: req.body.rating,
        photo: req.body.photo,
        owner: req.session.account._id,
    };

    try {
        const newfoodPlace = new FoodPlace(foodPlaceData);
        await newfoodPlace.save();

        return res.status(201).json({
            displayName: newfoodPlace.displayName,
            description: newfoodPlace.description,
            rating: newfoodPlace.rating,
            photo: newfoodPlace.photo,
        });
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'Food place with that name already exists' });
        }

        return res.status(500).json({ error: 'Error creating food place' });
    }
};

const getFoodPlace = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await FoodPlace.find(query)
            .select('displayName rating description photo')
            .lean()
            .exec();

        return res.json({ foodPlace: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching foodPlace' });
    }
};

module.exports = {
    makerFoodPlace,
    getFoodPlace,
};