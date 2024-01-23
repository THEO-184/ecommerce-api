import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class PrismaClientExceptionFilter<T> extends BaseExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': {
          const status = HttpStatus.CONFLICT;
          const message = exception.message
            .split('\n')
            .find((msg) => msg.toLowerCase().includes('constraint failed'));
          res.status(status).json({
            statusCode: status,
            message,
          });
          break;
        }

        case 'P2025': {
          res.status(HttpStatus.NOT_FOUND).json({
            message: exception.message,
            statusCode: HttpStatus.NOT_FOUND,
          });
          break;
        }

        case 'P2016': {
          const status = HttpStatus.NOT_IMPLEMENTED;
          const message = exception.message;
          res.status(status).json({
            statusCode: status,
            message: 'wrong ID',
          });
        }

        default:
          super.catch(exception, host);
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      res.status(422).json({
        statusCode: 422,
        message: exception.message.split('\n').at(-1),
      });
    } else if (exception instanceof NotFoundException) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: exception.message,
      });
    } else {
      super.catch(exception, host);
    }
  }
}
