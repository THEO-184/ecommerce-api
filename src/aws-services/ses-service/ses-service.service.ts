import { Injectable } from '@nestjs/common';
import {
  SESClient,
  ListIdentitiesCommand,
  VerifyEmailIdentityCommand,
} from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeSServiceService {
  private ses: SESClient;

  constructor(private config: ConfigService) {
    this.ses = new SESClient({
      credentials: {
        accessKeyId: this.config.get('BUCKET_ACCESS_KEY'),
        secretAccessKey: this.config.get('BUCKET_SECRET_ACCESS_KEY'),
      },
      region: this.config.get('BUCKET_REGION'),
    });
  }

  getSESClient() {
    return this.ses;
  }

  async verifyEmailAddress(email: string) {
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email });
    try {
      return await this.ses.send(command);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
