export interface IFacturaList {
    ID: number;
    Cliente: string;
    Fecha: string;
    Subtotal: number;
    Total: number;
    IVA: number;
}

export interface IRespListado {
    result: IFacturaList[];
}

export interface RootFacturaDesc {
    Factura: FacturaDesc
    Detalle: Detalle[]
  }
  
  export interface FacturaDesc {
    ID: number
    CedRuc: string
    Direccion: string
    Telefono: string
    Cliente: string
    Fecha: string
    Subtotal: number
    Total: number
    IVA: number
  }
  
  export interface Detalle {
    ID: number
    ID_Fac: number
    Nombre: string
    Precio: number
    Cant: number
    SubTotal: number
  }



  export interface RootFactPost {
    IdCliente?: number
    Subtotal?: number
    Total?: number
    IVA?: number
    Productos?: ProductoPost[]
  }

  export interface Productos {
    ID?: number
    Nombre?: string
    Precio?: number
    Costo?: number
    Stock?: number
    Estado?: number
    Codigo?: number
    Categoria?: number
  }
  
  export interface Cliente {
    ID?: number
    CedRuc?: string
    Nombres?: string
    Apellidos?: string
    Telefono?: string
    Direccion?: string
    Estado?: number,
    id?: number
    cedruc?: string
    nombres?: string
    apellidos?: string
    telefono?: string
    direccion?: string
    estado?: number
  }
  
  export interface ProductoPost {
    Id_Pro?: number,
    Nombre?:string,
    Cantidad?: number
    Precio?: number
    Subtotal?: number
  }