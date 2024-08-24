const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const UserSchema = require('../userModel');
const taskConfig = require('./config.json');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: taskConfig.taskTypes.values,
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: taskConfig.status.active,
        enum: taskConfig.status.values
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
})
taskSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('taskSchema', taskSchema);
