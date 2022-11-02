import { Injectable } from '@nestjs/common';
import { MailAuthCodeDto } from './dto/mail-auth-code.dto';
import { MailerCustomService } from './mailer-custom.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerCustomService) {}

  async sendAuthCode(mailDto: MailAuthCodeDto) {
    const { email, authCode } = mailDto;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenido/a a Custom App! Verificación de código.',
      template: '/send-auth-code',
      context: {
        name: email,
        authCode,
      },
    });
  }
}
