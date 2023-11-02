import $api from "../http";
import TaskDto from "../models/TaskDto";

export default class TaskService{
    static async tasks(): Promise<[]> {
        return (await $api.get('/tasks')).data;
    }
    static async createTask(title:string, index: number): Promise<TaskDto>{
        return (await $api.post('/task', {title, index})).data;
    }
    static async deleteTask(id:string){
        return await $api.delete(`/task/${id}`);
    }
    static async startTask(id:string){
        return await $api.post(`/task/start/${id}`);
    }
    static async stopTask(id:string){
        return await $api.post(`/task/stop/${id}`);
    }
    static async resumeTask(id:string){
        return await $api.post(`/task/resume/${id}`);
    }
    static async getTask(id:string):Promise<TaskDto>{
        return (await $api.get(`/task/${id}`)).data;
    }
    static async getTaskInfo(id:string):Promise<[]>{
        return (await $api.get(`/taskInfo/${id}`)).data;
    }
}