import { Injectable } from '@nestjs/common';
import { MailAuthCodeDto } from './modules/mail/dto/mail-auth-code.dto';
import { MailService } from './modules/mail/mail.service';

export interface IBody {
  email: string;
}

@Injectable()
export class AppService {
  constructor(private readonly _mailService: MailService) {}

  async getHello(body: IBody): Promise<string> {
    const mailDto = new MailAuthCodeDto();
    mailDto.email = body.email;
    mailDto.authCode = '12345';
    await this._mailService.sendAuthCode(mailDto);
    return 'Hello World!';
  }
}
