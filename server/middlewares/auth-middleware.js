const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = async function(req, res, next){
    try{
        console.log(req.method, req.originalUrl);

        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnathorizedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken){
            return next(ApiError.UnathorizedError());
        }

        const userData = await tokenService.validateAccessToken(accessToken);
        if(!userData || !userData?.isActivated){
            return next(ApiError.UnathorizedError());
        }
        req.user = userData;
        next();

    } catch(e) {
        return next(ApiError.UnathorizedError());
    }
}