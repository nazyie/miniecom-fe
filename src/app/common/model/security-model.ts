export interface ResponseLogin {
  refreshToken: string,
  accessToken: string
}

export interface ResponseAccessToken {
  accessToken: string
}

export interface RequestAccessToken {
  refreshToken: string
}

export interface RequestLogout {
  refreshToken: string
}
