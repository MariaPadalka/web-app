const UserModel = require('../models/user-model');
const TaskModel = require('../models/task-model');
const UserService = require('../services/user-service');
const TaskService = require('../services/task-service');
const tokenService = require('../services/token-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class TaskController{
    async create(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Помилка при валідації", errors.array()));
            }
            const { title, index } = req.body;
            const {refreshToken} = req.cookies;
            const userData = await tokenService.validateRefreshToken(refreshToken);
            const user = await UserModel.findById(userData.id)
            if(!user){
              throw ApiError.BadRequest('Такого користувача не існує')
            }
            const taskData = await TaskService.create(title, userData.id, index);
            
            return res.json(taskData);
        } catch(e){
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
              throw ApiError.BadRequest('Такого користувача не існує');
            }

            const taskToDelete = await TaskModel.findById(taskId);
            if(!taskToDelete){
                throw ApiError.BadRequest('Такого завдання не існує');
            }

            if(taskToDelete.userId != user.id){
                throw ApiError.BadRequest('Ви не є власником завдання');
            }

            const taskData = await TaskService.delete(taskToDelete.id);
            return res.json(taskData);
        } catch(e){
            next(e);
        }
    }

    async stop(req, res, next){
        try{
            
        } catch(e){
            next(e);
        }
    }

    async resume(req, res, next){
        try{
            
        } catch(e){
            next(e);
        }
    }

    async getTaskInfo(req, res, next){
        try{
           
        } catch(e){
            next(e);
        }
    }

    async refresh(req, res, next){
        try{
            
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
              throw ApiError.BadRequest('Такого користувача не існує')
            }
            const tasks = await TaskService.getAllTasks(user.id);
            return res.json(tasks);
        } catch(e){
            console.log(e);
        }
    }
}

module.exports = new TaskController();