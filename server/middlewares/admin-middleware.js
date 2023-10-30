const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = async function(req, res, next){
    try{
        const authorizationHeader = req.headers.authorization;
        const accessToken = authorizationHeader.split(' ')[1];
        const userData = await tokenService.validateAccessToken(accessToken);

        if(!userData.isAdmin){
            return next(ApiError.ForbidenError());
        }

        next();

    } catch(e) {
        return next(ApiError.UnathorizedError());
    }
}