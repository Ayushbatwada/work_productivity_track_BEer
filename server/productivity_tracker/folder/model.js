'use strict'

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const folderConfig = require('./config.json');
const UerSchema = require('../userModel');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true,
        enum: folderConfig.folderCategories.values
    },
    taskCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: folderConfig.status.active,
        enum: folderConfig.status.values
    },
    createdBy: {
        type: UerSchema,
        required: true
    },
    updatedBy: {
        type: UerSchema
    }
},{
    timestamps: true
});

folderSchema.plugin(mongoosePaginate);
folderSchema.index({folderName: 1});
module.exports = mongoose.model('folderSchema', folderSchema);
