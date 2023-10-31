const TaskModel = require("../models/task-model");
const TaskLogModel = require("../models/taskLog-model");
const IntermidiateResultModel = require("../models/intermediateResult-model");
const TaskDto = require("../dto/task-dto");
const tokenService = require("../services/token-service");
const ApiError = require("../exceptions/api-error");
const taskLogModel = require("../models/taskLog-model");


class TaskService {
  async create(title, userId, index) {
    const task = await TaskModel.create({
        title: title, 
        userId: userId,
        index: index
    });
    const taskLog = await TaskLogModel.create({
      taskId: task.id,
      description: "Created",
      time: new Date()
    })

    //const result = await TaskService.calculate(index);

    return task;
  }

  async calculate(taskId, n, prev = 0, cur = 1, i = 1) {
    var task = await TaskModel.findById(taskId);
    task.status = "In Progress";
    await task.save();

    const taskLog = await TaskLogModel.create({
      taskId: task.id,
      description: "Started calculating",
      time: new Date()
    })

    if( n == 1 ){
      task.status = "Done";
      await task.save();
      return 0;
    }
    let result = prev + cur;

    for (i; i < n - 1; i++) {

        result = prev + cur;
        prev = cur;
        cur = result;


        var percentage = Math.round((i / (n - 1)) * 100);
        task.percentage = percentage;
        await task.save();

        // Introduce a half-second delay using setTimeout
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    task.percentage = 100;
    task.result = result;
    task.status = "Done";
    await task.save();

    const taskLog2 = await TaskLogModel.create({
      taskId: task.id,
      description: "Finished calculating",
      time: new Date()
    })

    return result;
  }

  async delete(taskId){
    const task = await TaskModel.deleteOne({_id: taskId});
    const taskLog = await TaskLogModel.deleteMany({taskId: taskId});
    return {task};
  }

  async getAllTasks(userId){
    const tasks = await TaskModel.find({userId: userId});
    const tasksDto = tasks.map(task => new TaskDto(task));
    return tasksDto;
  }
}
module.exports = new TaskService();
