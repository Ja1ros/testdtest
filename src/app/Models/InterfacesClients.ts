export interface IRespCliente {
    data?: ICliente[]
    msg?: string
    status?: number
  }
  
  export interface ICliente {
    ID?: number
    CedRuc?: string
    Nombres?: string
    Apellidos?: string
    Telefono?: string
    Direccion?: string
    Estado?: number
    Correo?: string
    Contra?: string
  }


  export interface ClienteRequest {
    id?:number;
    cedula?: string;
    nombres?: string;
    apellidos?: string;
    direccion?: string;
    telefono?: string;
    pass?: string;
    estado?: number;
    email?: string;
}