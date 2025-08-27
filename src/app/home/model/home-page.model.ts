export interface RequestLogin {
  email: string,
  password: string
}

export interface RequestRegister {
  firstName: string,
  secondName: string,
  email: string,
  password: string,
  phoneNo: string
}

export interface RequestForgotPassword {
  email: string
}
