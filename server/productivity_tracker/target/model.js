const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const targetSchema = new mongoose.Schema({
    description: {
        type: String
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
        default: 'assigned',
        enum: ['assigned', 'active', 'completed', 'paused', 'deleted', 'delayed']
    },
    createdBy: {
        type: Object
    },
    updatedBy: {
        type: Object
    }
},{
    timestamps: true
});

targetSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('targetSchema', targetSchema);
