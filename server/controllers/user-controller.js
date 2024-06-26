const UserService = require('../services/user-service');
const mailService = require('../services/mail-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController{
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const { email, password, isAdmin } = req.body;
            const userData = await UserService.registration(email, password, isAdmin);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, htppOnly: true, secure:true})
            return res.json(userData);
        } catch(e){
            next(e);
        }
    }

    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, htppOnly: true, secure:true})
            return res.json(userData);
        } catch(e){
            next(e);
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            return res.json(token);
        } catch(e){
            next(e);
        }
    }

    async activate(req, res, next){
        try{
            const link = req.params.link;
            await UserService.activate(link);
            return res.redirect(process.env.CLIENT_URL);
        } catch(e){
            next(e);
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, htppOnly: true, secure:true})
            return res.json(userData);
        } catch(e){
            next(e);
        }
    }

    async getUsers(req, res, next){
        try{
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch(e){
            next(e);
        }
    }

    async deleteUserById(req, res, next){
        try{
            const userId = req.params.id;
            const deletedUser = await UserService.deleteUserById(userId);
            return res.json(deletedUser);
        }catch(e){
            next(e);
        }
    }
}

module.exports = new UserController();