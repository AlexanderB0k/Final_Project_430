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
        if (_id) {
            const profile = await Profile.findOne({
                _id,
                owner: req.session.account._id,
            });

            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }

            profile.displayName = displayName;
            profile.age = age;
            profile.description = description;
            profile.photo = photo;

            await profile.save();

            return res.status(200).json({
                _id: profile._id,
                displayName: profile.displayName,
                age: profile.age,
                description: profile.description,
                photo: profile.photo,
                owner: profile.owner,
            });
        }

        // CREATE new profile
        if (!photo) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const profileData = {
            displayName,
            age,
            description,
            photo,
            owner: req.session.account._id,
        };

        const newProfile = new Profile(profileData);
        await newProfile.save();

        return res.status(201).json({
            _id: newProfile._id,
            displayName: newProfile.displayName,
            age: newProfile.age,
            description: newProfile.description,
            photo: newProfile.photo,
            owner: newProfile.owner,
        });
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'Profile with that name already exists' });
        }

        return res.status(500).json({ error: 'Error saving profile' });
    }
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
};