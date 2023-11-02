import IUser from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import TaskService from "../services/TaskService";
import TaskDto from "../models/TaskDto";
import UserService from "../services/UserService";
import TaskLog from "../models/TaskLog";

export default class Store{
    user = {} as IUser;
    isAuth = false;
    isLoading=false;
    tasks = [] as TaskDto[];

    constructor(){
        makeAutoObservable(this);
    }

    setAuth(value: boolean){
        this.isAuth = value;
    }

    setUser(user:IUser){
        this.user = user;
    }

    setLoading(value:boolean){
        this.isLoading = value;
    }
    setTasks(value: TaskDto[]){
        this.tasks = value;
    }

    async login(email:string, password: string){
        try{
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch(e: any){
            console.log(e);
            return e.response?.data?.message;
        }
    }

    async registration(email:string, password: string, isAdmin: boolean){
        try{
            const response = await AuthService.registration(email, password, isAdmin);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch(e: any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async logout(){
        try{
            this.setLoading(true);
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        }catch(e: any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        } finally{
            this.setLoading(false);
        }
    }

    async deleteUser(id: string){
        try{
            const response = await UserService.deleteUser(id);
            console.log(id, this.user.id);
            console.log(id === this.user.id);
            if(id === this.user.id.toString()){
                this.logout()
            }
        }catch(e: any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials:true});
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        }catch(e){
            console.log(e);
        } finally{
            this.setLoading(false);
        }
    }

    async getUsers(){
        try{
            const data = await UserService.getUsers();
            if(!data){
                return [] as IUser[]
            }
            var users = data.reverse() as IUser[];
            return users;
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
    }

    async getTasks(){
        try{
            const data = await TaskService.tasks();
            this.setTasks(data.reverse());
        }
        catch(e: any){
            console.log(e.response?.data?.message);
        }
    }

    async createTask(title:string, index: number){
        try{
            const newTask = await TaskService.createTask(title, index);
            console.log('newTask:', newTask);
            const updatedTasks = [newTask, ...this.tasks];
            this.setTasks(updatedTasks);
        }catch(e: any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async deleteTask(id:string){
        try{
            const deletedTask = await TaskService.deleteTask(id);
            const updatedTasks = this.tasks.filter(task => task._id !== id);
            this.setTasks(updatedTasks);
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async getTask(id:string){
        try{
            const returnedTask = await TaskService.getTask(id);
            // Отримайте індекс завдання зі списку this.tasks за його ідентифікатором
            const taskIndex = this.tasks.findIndex(task => task._id === id);

            if (taskIndex !== -1) {
            // Якщо завдання із вказаним ідентифікатором знайдено, оновіть його
            this.tasks[taskIndex] = returnedTask;
            } else {
            // Якщо завдання не знайдено, додайте його до списку
            this.tasks.unshift(returnedTask);
            }

            this.setTasks([...this.tasks]);
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async getTaskInfo(id:string){
        try{
            const returnedTaskLog = await TaskService.getTaskInfo(id);
            
            return returnedTaskLog as TaskLog[];
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async startTask(id:string){
        try{
            const result = await TaskService.startTask(id);
            this.getTasks();
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async stopTask(id:string){
        try{
            const result = await TaskService.stopTask(id);
            this.getTask(id);
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

    async resumeTask(id:string){
        try{
            const result = await TaskService.resumeTask(id);
            this.getTask(id);
        }catch(e:any){
            console.log(e.response?.data?.message);
            return e.response?.data?.message;
        }
    }

}