const {Schema, model} = require('mongoose');

const IntermidiateResultSchema = new Schema({
    taskId: {type:Schema.Types.ObjectId, ref: 'Task', required:true},
    prevNumber: {type: Number, required: true},
    currNumber: {type:Number, required: true},
    index: {type:Number, required:true},
})

module.exports = model('IntermidiateResult', IntermidiateResultSchema);