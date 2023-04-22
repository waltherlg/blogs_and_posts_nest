import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
const emailUser = process.env.MAIL_USER;
const emailPassword = process.env.MAIL_PASSWORD;
if (!emailUser || !emailPassword) {
  throw new Error('password or user for emailAdapter not found');
}
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailAdapter {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to: to,
      subject: subject,
      text: text,
    });
  }
}
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      },
    }),
  ],
})
export class AppModule {}
