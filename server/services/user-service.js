const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dto/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, password, isAdmin) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest("This email is already taken");
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email: email,
      password: hashPassword,
      activationLink: activationLink,
      isAdmin: isAdmin, 
    });
    const fullLink = process.env.API_URL + '/api/activate/' + activationLink
    await mailService.sendActivationMail(email, fullLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  async activate(link) {
    const user = await UserModel.findOne({activationLink: link})
    if(!user){
      throw ApiError.BadRequest('Invalid link for activation')
    }
    user.isActivated = true;
    await user.save();
  }
  
  async login(email, password){
    const user = await UserModel.findOne({email});
    if(!user){
      throw ApiError.BadRequest('There is no such user');
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if(!passwordsMatch){
      throw ApiError.BadRequest('Incorrect password');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }

  async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken){
    if(!refreshToken){
      throw ApiError.UnathorizedError();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if(!userData || !tokenFromDb){
      throw ApiError.UnathorizedError()
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto
    };
  }

  async getAllUsers(){
    const users = await UserModel.find();
    return users;
  }
}
module.exports = new UserService();
