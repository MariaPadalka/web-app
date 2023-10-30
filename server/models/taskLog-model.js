const {Schema, model} = require('mongoose');

const TaskLogSchema = new Schema({
    taskId: {type:Schema.Types.ObjectId, ref: 'Task', required:true},
    time: {type: Date, required: true},
    description: {type:String, required: true},
})

module.exports = model('TaskLog', TaskLogSchema);