const {Schema, model} = require('mongoose');

const IntermidiateResultSchema = new Schema({
    taskId: {type:Schema.Types.ObjectId, ref: 'Task', required:true},
    prevNumber: {type: Schema.Types.Long, required: true},
    currNumber: {type:Schema.Types.Long, required: true},
    index: {type:Schema.Types.Long, required:true},
})

module.exports = model('IntermidiateResult', IntermidiateResultSchema);