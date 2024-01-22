import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ServiceService {
  private s3: S3Client;
  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.config.get('BUCKET_ACCESS_KEY'),
        secretAccessKey: this.config.get('BUCKET_SECRET_ACCESS_KEY'),
      },
      region: this.config.get('BUCKET_REGION'),
    });
  }

  getS3Client() {
    return this.s3;
  }
}
