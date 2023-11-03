const ApiError = require('../exceptions/api-error');

module.exports = async function(req, res, next){
    try{
        console.log(req.method, req.originalUrl);
        next();

    } catch(e) {
        return next(ApiError.BadRequest());
    }
}