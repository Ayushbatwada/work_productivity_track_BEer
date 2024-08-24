const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const updatesSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    updatesDate: {
        type: Date,
        required: true
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

updatesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('updateSchema', updatesSchema);
