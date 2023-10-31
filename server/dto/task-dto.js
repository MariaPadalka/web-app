module.exports = class TaskDto{
    _id;
    title;
    index;
    result;
    status;
    percentage;
    constructor(model){
        this._id = model._id;
        this.title = model.title;
        this.index = model.index;
        this.result = model.result;
        this.status = model.status;
        this.percentage = model.percentage;
    }
}