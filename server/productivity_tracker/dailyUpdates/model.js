'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const UserSchema = require('../userModel');
const dailyUpdatesConfig = require('./config.json');

const updatesSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    updatesDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: dailyUpdatesConfig.status.active
    },
    createdBy: {
        type: UserSchema,
        required: true
    },
    updatedBy: {
        type: UserSchema
    }
},{
    timestamps: true
});

updatesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('updateSchema', updatesSchema);
