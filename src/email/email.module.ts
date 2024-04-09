import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as AWS from 'aws-sdk';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SeSServiceService } from 'src/aws-services/ses-service/ses-service.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          SES: new AWS.SES({
            region: config.get('AWS_SES_REGION'),
            accessKeyId: config.get('BUCKET_ACCESS_KEY'),
            secretAccessKey: config.get('BUCKET_SECRET_ACCESS_KEY'),
          }),
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: true,

          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
          debug: true,
        },
        defaults: {
          from: `"FROM" <${config.get('MAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [EmailController],
  providers: [EmailService, SeSServiceService],
})
export class EmailModule {}
