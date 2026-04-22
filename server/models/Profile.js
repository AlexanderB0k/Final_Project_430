const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },

    name: {
        type: String,
        trim: true,
        default: '',
    },

    age: {
        type: Number,
        min: 0,
        default: 0,
    },

    info: {
        type: String,
        trim: true,
        default: '',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

Schema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    info: doc.info,
    owner: doc.owner,
    createdDate: doc.createdDate
});

const ProfileModel = mongoose.model('Profile', ProfileSchema);
module.exports = ProfileModel;

