const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

//Created a rating system with 
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },

    originFood: {
        type: String,
        required: true,
        trim: true,
    },

    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileModel',
        required: true,
    },

    starRating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },

    createdDate: {
        type: Date,
        default: Date.now,
    },
});

Schema.statics.toAPI = (doc) => ({
    _id: doc._id,
    name: doc.name,
    originFood: doc.originFood,
    photo: doc.photo,
    starRating: doc.starRating,
    owner: doc.owner,
    createdDate: doc.createdDate,
});

const RatingModel = mongoose.model('Rating', Schema);
module.exports = RatingModel;