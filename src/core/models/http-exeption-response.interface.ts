export interface HttpExeptionResponse {
  statusCode: number;
  error: string;
}

export interface CustomHttpExeptionResponse extends HttpExeptionResponse {
  path: string;
  method: string;
  timeStamp: Date;
}
