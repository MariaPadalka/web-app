import $api from "../http";
import { AxiosResponse } from "axios";
import IUser from "../models/IUser";

export default class UserService{
    static async getUsers(): Promise<IUser[]>{
        return (await $api.get('/users')).data;
    }
    static async deleteUser(id: string): Promise<IUser[]>{
        return (await $api.delete(`/user/${id}`)).data;
    }
}