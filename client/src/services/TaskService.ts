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
}