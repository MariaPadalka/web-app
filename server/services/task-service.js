const TaskModel = require("../models/task-model");
const TaskLog = require("../models/taskLog-model");
const tokenService = require("../services/token-service");
const ApiError = require("../exceptions/api-error");


class TaskService {
  async create(title, userId, index) {
    const task = await TaskModel.create({
        title: title, 
        userId: userId,
        index: index
    });
    console.log('task', task);
    const taskLog = await TaskLog.create({
      taskId: task.id,
      description: "Created",
      time: new Date()
    })

    const result = await TaskService.calculate(index);

    return {
        task,
        taskLog,
        result
    };
  }

  static async calculate(n, prev = 0, cur = 1) {
    
    if( n == 1 ){
      return 0;
    }
    let result = prev + cur;

    for (let i = 1; i < n - 1; i++) {
        result = prev + cur;
        prev = cur;
        cur = result;
        // Introduce a half-second delay using setTimeout
        await new Promise(resolve => setTimeout(resolve, 500));
        // надсилати через веб сокет відсоток виконання завдання
    }

    return result;
  }

  async delete(taskId){
    const task = await TaskModel.deleteOne({_id: taskId});
    const taskLog = await TaskLog.deleteMany({taskId: taskId});
    return {task , taskLog};
  }

  async getAllTasks(userId){
    const tasks = await TaskModel.find({userId: userId});
    return tasks;
  }
}
module.exports = new TaskService();
