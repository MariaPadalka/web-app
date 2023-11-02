const TaskModel = require("../models/task-model");
const TaskLogModel = require("../models/taskLog-model");
const IntermidiateResultModel = require("../models/intermediateResult-model");
const TaskDto = require("../dto/task-dto");
const tokenService = require("../services/token-service");
const ApiError = require("../exceptions/api-error");


class TaskService {
  async create(title, userId, index) {
    const numOfTasks = await TaskModel.count({userId:userId});
    if(numOfTasks >= 20){
      throw ApiError.BadRequest("You have exceeded the limit of tasks. Delete some to create new ones");
    }
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
      task = await TaskModel.findById(taskId);
      if(task.status == "Paused"){
        
        const existingIntermResult = await IntermidiateResultModel.findOne({ taskId: task.id });

        if (existingIntermResult) {
          existingIntermResult.prevNumber = prev;
          existingIntermResult.currNumber = cur;
          existingIntermResult.index = i;
          await existingIntermResult.save();
        } else {
          const intermResult = await IntermidiateResultModel.create({
            taskId: taskId,
            prevNumber: prev,
            currNumber:cur,
            index: i
          })
        }
          return;
      }

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

  async getTaskInfo(taskId){
    const taskLogs = await TaskLogModel.find({taskId: taskId});
    return taskLogs;
  }

  async stopTask(taskId){
    const task = await TaskModel.findById(taskId); 
    task.status = "Paused";
    await task.save();
    const taskDto = new TaskDto(task);

    const taskLog = await TaskLogModel.create({
      taskId: task.id,
      description: "Paused",
      time: new Date()
    });

    return taskDto;
  }

  async resumeTask(taskId){
    const task = await TaskModel.findById(taskId); 
    task.status = "In Progress";
    await task.save();
    const intermediateResult = await IntermidiateResultModel.findOne({taskId: taskId});
    if(!intermediateResult){
      throw ApiError.BadRequest("There is no intermediate results for your task. Start it again.");
    }
    const result = await this.calculate(taskId, task.index, intermediateResult.prevNumber, intermediateResult.currNumber, intermediateResult.index);

    return result
  }

  async delete(taskId){
    const task = await TaskModel.deleteOne({_id: taskId});
    const taskLog = await TaskLogModel.deleteMany({taskId: taskId});
    const intermediateResult = await IntermidiateResultModel.deleteMany({taskId: taskId});
    return {task};
  }

  async getAllTasks(userId){
    const tasks = await TaskModel.find({userId: userId});
    const tasksDto = tasks.map(task => new TaskDto(task));
    return tasksDto;
  }
}
module.exports = new TaskService();
