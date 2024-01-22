export interface ResponseUser {
    ID?: number;
    UserName?: string;
    UserPassword?: string;
    Nombres?: string;
    Estado?: number; 
    Cedula?: string;
}

export interface IRespUser {
    data: ResponseUser[];
    msg: string;
    status: number;
}

export interface UserRequest {
    id?: number;
    cedula?: string;
    username?: string;
    password?: string;
    nombres?: string;
    estado?: number;
    rol?:string;
}