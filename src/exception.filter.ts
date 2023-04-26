import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (process.env.envorinment !== 'production') {
      response
        .status(500)
        .send({ error: exception.toString(), stack: exception.stack });
    } else {
      response.status(500).send('some error occurred');
    }
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === 400) {
      const errorsResponse = {
        errors: [],
      };
      const responseBody: any = exception.getResponse();
      console.log(responseBody);
      if (responseBody.message) {
        responseBody.message.forEach((m) => errorsResponse.errors.push(m));
        response.status(status).json(errorsResponse);
      } else {
        const errors: any = exception.getResponse();
        console.log(errors);
        response.status(status).json({ errors });
      }
    } else {
      const errors: any = exception.getResponse();
      console.log(errors);
      response.status(status).json({ errors });
      // const match = responseBody.match(/^\w+/);
      // const field = match ? match[0] : 'unknown';
      // response.status(status).json({
      //   errors: [
      //     {
      //       message: responseBody,
      //       field: field,
      //     },
      //   ],
      // });
      // тело реквеста, как оно было
      // response.status(status).json({
      //   statusCode: status,
      //   timestamp: new Date().toISOString(),
      //   path: request.url,
      // });
    }
  }
}
