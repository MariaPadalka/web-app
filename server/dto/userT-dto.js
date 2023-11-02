module.exports = class UserTdto{
    email;
    id;
    isActivated;
    isAdmin;
    numOfTasks
    constructor(model, numOfTasks = undefined){
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.isAdmin = model.isAdmin;
        this.numOfTasks = numOfTasks;
        this.numOfTasks = numOfTasks;
    }
}