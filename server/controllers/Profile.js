const model = require('../models')
const profile = model.Profile;

const getProfile = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Profile.find(query)
            .select('name info age')
            .lean()
            .exec();

        return res.json({ foodPlace: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching foodPlace' });
    }
};

const saveProfile = async (req, res) => {

    if (!req.body.name || !req.body.info || !req.body.age) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        let profile = await Profile.findOne({ owner: req.session.account._id });

        if (!profile) {
            profile = new Profile({
                owner: req.session.account._id,
                name,
                age,
                description,
            });
        } else {
            profile.name = name;
            profile.age = age;
            profile.description = description;
        }

        await profile.save();
        return res.json({ message: 'Profile saved successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Error saving profile' });
    }
};

const updateProfileField = async (req, res) => {

    if (!req.body.field || req.body.value === undefined) {
        return res.status(400).json({ error: 'Field and value are required' });
    }


};

module.exports = {
    getProfile,
    saveProfile,
    updateProfileField,
};

