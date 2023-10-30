module.exports = class ApiError extends Error{
    status;
    errors;

    constructor(status, message, errors = []){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnathorizedError(){
        return new ApiError(401, "Користовач не авторизований");
    }

    static ForbidenError(){
        return new ApiError(403, "У користувача недостатньо прав для перегляду контенту");
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors);
    }
}