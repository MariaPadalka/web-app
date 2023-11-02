const UserModel = require('../models/user-model');
const TaskModel = require('../models/task-model');
const UserService = require('../services/user-service');
const TaskService = require('../services/task-service');
const tokenService = require('../services/token-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');
const TaskDto = require('../dto/task-dto');

class TaskController{
    async create(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { title, index } = req.body;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user')
            }
            const taskData = await TaskService.create(title, user.id, index);
            const taskDto = new TaskDto(taskData);
            
            return res.json(taskDto);
        } catch(e){
            next(e);
        }
    }

    async start(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToStart = await TaskModel.findById(taskId);

            if(!taskToStart){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToStart.userId != user.id){
                throw ApiError.ForbidenError();
            }

            const result = await TaskService.calculate(taskToStart._id, taskToStart.index);

            return res.json(result)

        }catch(e){
            next(e);
        }
    }

    async delete(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToDelete = await TaskModel.findById(taskId);

            if(!taskToDelete){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToDelete.userId != user.id){
                throw ApiError.ForbidenError();
            }

            const taskData = await TaskService.delete(taskToDelete.id);
            return res.json(taskData);
        } catch(e){
            next(e);
        }
    }

    async getTasks(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }
            const tasks = await TaskService.getAllTasks(user.id);
            return res.json(tasks);
        } catch(e){
            console.log(e);
        }
    }

    async getTask(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToGet = await TaskModel.findById(taskId);
            const taskDto = new TaskDto(taskToGet);

            if(!taskToGet){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToGet.userId != user.id){
                throw ApiError.ForbidenError();
            }

            return res.json(taskDto);
        } catch(e){
            next(e);
        }
    }

    async getTaskInfo(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToGet = await TaskModel.findById(taskId);

            if(!taskToGet){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToGet.userId != user.id){
                throw ApiError.ForbidenError();
            }

            const taskLogs = await TaskService.getTaskInfo(taskId);

            return res.json(taskLogs);
        } catch(e){
            next(e);
        }
    }

    async stopTask(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToGet = await TaskModel.findById(taskId);

            if(!taskToGet){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToGet.userId != user.id){
                throw ApiError.ForbidenError();
            }
            const taskDto = await TaskService.stopTask(taskToGet.id);

            return res.json(taskDto);
        }catch(e){
            next(e);
        }
    }

    async resumeTask(req, res, next){
        try{
            const taskId = req.params.id;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('There is no such user');
            }

            const taskToGet = await TaskModel.findById(taskId);

            if(!taskToGet){
                throw ApiError.BadRequest('There is no such task');
            }

            if(taskToGet.userId != user.id){
                throw ApiError.ForbidenError();
            }
            const result = await TaskService.resumeTask(taskToGet.id);

            return res.json(result);
        }catch(e){
            next(e);
        }
    }
}

module.exports = new TaskController();