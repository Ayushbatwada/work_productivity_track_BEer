const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const UserSchema = require('../userModel');

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
        enum: ['project', 'reading', 'dsa', 'system design', 'reminder'],
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: 'created',
        enum: ['created', 'active', 'completed', 'paused', 'inactive']
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
