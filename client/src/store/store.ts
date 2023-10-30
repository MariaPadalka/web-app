import { IUser } from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store{
    user = {} as IUser;
    isAuth = false;
    isLoading=false;

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

    async registration(email:string, password: string){
        try{
            const response = await AuthService.registration(email, password);
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
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
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

}