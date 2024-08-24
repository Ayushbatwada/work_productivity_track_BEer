'use strict'

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const targetConfig = require('./config.json');
const UserSchema = require('../userModel');

const targetSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    associatedTaskIds: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    completedOn: {
        type: Date
    },
    status: {
        type: String,
        default: targetConfig.status.assigned,
        enum: targetConfig.status.values
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

targetSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('targetSchema', targetSchema);
