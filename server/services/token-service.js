const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1d'});
        return{
            accessToken,
            refreshToken
        }
    }

    async validateAccessToken(token){
        try{
            const userData = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch{
            return null;
        }
    }

    async validateRefreshToken(token){
        try{
            const userData = await jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch{
            return null;
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId});
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken: refreshToken});
        return tokenData;
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
}
module.exports = new TokenService();