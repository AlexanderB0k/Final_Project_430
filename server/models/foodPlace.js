const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

//Created a rating system with 
const Schema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },

    rating: {
        type: Number,
        required: true,
        min: 0,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileModel',
        required: true,
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
    displayName: doc.displayName,
    rating: doc.rating,
    description: doc.description,
    photo: doc.photo,
    owner: doc.owner,
    createdDate: doc.createdDate,
});

const foodPlaceModel = mongoose.model('foodPlace', Schema);
module.exports = foodPlaceModel;