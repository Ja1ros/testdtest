export interface ILogin {
  username?: string;
  password?: string;
}

export interface IResp {
  data: DataLogin
  msg: string
  status: number
}

export interface DataLogin {
  user: User
  token: string
}

export interface User {
  id?: number
  userName?: string
  Nombres?: string
  Cedula?: string
  RollName?: string
  Estado?: number
}
