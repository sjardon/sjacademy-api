import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CustomHttpExeptionResponse,
  HttpExeptionResponse,
} from './models/http-exeption-response.interface';
import * as fs from 'fs';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exeption: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exeption instanceof HttpException) {
      status = exeption.getStatus();
      const errorResponse = exeption.getResponse();
      errorMessage =
        (errorResponse as HttpExeptionResponse).error || exeption.message;
    } else {
      console.log('httpexeception');
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error ocurred!';
    }

    const errorResponse: CustomHttpExeptionResponse = this.getErrorResponse(
      status,
      errorMessage,
      request,
    );
    const errorLog = this.getErrorLog(errorResponse, request, exeption);
    this.writeErrorLogToFile(errorLog);
    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExeptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExeptionResponse,
    request: Request,
    exeption: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}
    ${JSON.stringify('Not signed in')}
    ${exeption instanceof HttpException ? exeption.stack : error}`;
    return errorLog;
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('logs/error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}
