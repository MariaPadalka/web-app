export default interface IUser{
    email: string;
    isActivated: boolean;
    isAdmin: boolean;
    id: string;
    numOfTasks?: number
}