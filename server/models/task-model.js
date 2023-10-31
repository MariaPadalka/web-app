const {Schema, model} = require('mongoose');

const taskStatuses = ['Waiting', 'In Progress', 'Paussed', 'Done'];

const TaskSchema = new Schema({
    title: {type:String,  required:true},
    userId: {type:Schema.Types.ObjectId, ref: 'User', required:true},
    index: {type: Number, required:true},
    result: {type: Number, default: -1},
    status: {
        type: String,
        enum: taskStatuses, // Specify the allowed values
        default: 'Waiting',
    },
    percentage: {
        type: Number,
        default: 0
    }
})

module.exports = model('Task', TaskSchema);