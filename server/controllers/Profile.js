const models = require('../models');
const Profile = models.Profile;

const getProfile = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };

        const doc = await Profile.findOne(query)
            .select('name info age')
            .lean()
            .exec();

        return res.json({ profile: doc });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching profile' });
    }
};

const saveProfile = async (req, res) => {    
    if (!req.body.name || !req.body.info || !req.body.age) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const { name, info, age } = req.body;

    try {
        await Profile.findOneAndUpdate(
            { owner: req.session.account._id },
            { name, info, age, owner: req.session.account._id },
            { upsert: true, new: true }
        );

        return res.json({ message: 'Profile saved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error saving profile' });
    }
};

module.exports = {
    getProfile,
    saveProfile,
};