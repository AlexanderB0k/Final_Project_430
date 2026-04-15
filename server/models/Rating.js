const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

//Created a rating system with 
const Schema = new mongoose.Schema({
    //reminder: This is the name of the food
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account',
    },
    OriginFood: {
        type: String,
        required: true,
        trim: true,
    },
    starRating: {
        type: Number,
        min: 0,
        max: 5, 
    },
    image: {
        type: String,
        data: Buffer,   
        contentType: String, 
    },
    desscription: {
        type: String,
        required: true,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

Schema.statics.toAPI = (doc) => ({
    name: doc.name,
    origin: doc.OriginFood,
    image: doc.image,
    rating: doc.starRating,
});

const RatingModel = mongoose.model('Rating', Schema);
module.exports = RatingModel;