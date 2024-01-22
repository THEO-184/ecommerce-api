import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileSizeValidationPipe<T extends Express.Multer.File>
  implements PipeTransform<T>
{
  transform(value: T, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
