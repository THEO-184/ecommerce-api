import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SeSServiceService } from 'src/aws-services/ses-service/ses-service.service';
import { EventPayloads } from 'src/common/types/event-types.interface';
import { SendEmailCommand } from '@aws-sdk/client-ses';

interface User {
  name: string;
  email: string;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private sesService: SeSServiceService,
  ) {}

  @OnEvent('order.create')
  async sendOrderCreationEmail(data: EventPayloads['order.create']) {
    const sendEmailCommand = this.createSendEmailCommand(data);
    const { email, name, subject, totalCost } = data;

    console.log({ email, name, subject, totalCost });

    console.log('triggered');
    try {
      const response = await this.sesService
        .getSESClient()
        .send(sendEmailCommand);
      return response;
      console.log('send email response', response);
    } catch (error) {
      console.log('send order email error', error);

      throw error;
    }

    console.log('email sent');
  }

  createSendEmailCommand(data: EventPayloads['order.create']) {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          data.email,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: `<h1>totalCost: ${data.totalCost}</h1>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; text-align: center;">
    <h2 style="color: #333;">Total Order Cost</h2>
    <p style="font-size: 24px; color: #555; margin-top: 10px;">${data.totalCost}</p>
</div>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: 'theophilusboakye47@gmail.com',
      ReplyToAddresses: [
        /* more items */
      ],
    });
  }
}
