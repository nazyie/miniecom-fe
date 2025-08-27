export interface ErrorResponse {
  error: Error
}

interface Error {
  status: number,
  error: string,
  message: string
}
