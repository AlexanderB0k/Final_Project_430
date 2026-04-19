const models = require('../models');
const Profile = models.Profile;

const makerProfile = async (req, res) => {
    if (!req.body.displayName || !req.body.age || !req.body.description || !req.body.photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const profileData = {
        displayName: req.body.displayName,
        age: req.body.age,
        description: req.body.description,
        photo: req.body.photo,
        owner: req.session.account._id,
    };

    try {
        const newProfile = new Profile(profileData);
        await newProfile.save();
        return res.status(201).json({ displayName: newProfile.displayName, age: newProfile.age, description: newProfile.description, photo: newProfile.photo, owner: newProfile.owner });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Profile with that name already exists' });
        }
        return res.status(500).json({ error: 'Error creating profile ' });
    }
};

const profilePage = (req, res) => {
    res.render('app'); 
};

const getProfiles = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Profile.find(query).select('displayName age description photo').lean().exec();
        return res.json({ profiles: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching profiles' });
    }
};

module.exports = {
    makerProfile,
    getProfiles,
    profilePage,
};