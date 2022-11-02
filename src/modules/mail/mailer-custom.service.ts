/* eslint-disable no-param-reassign */
/* eslint-disable id-blacklist */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { throwCustomHttpException } from '../../shared/exception/throw-custom-exception';
import { CustomMessages } from '../../shared/exception/custom-messages';
import { StringUtil } from '../../shared/utils/string-util';

interface IMailCustomOptions {
  to: string;
  subject: string;
  template: string;
  context: any;
}

@Injectable()
export class MailerCustomService {
  private readonly logger = new CustomLoggerService(MailerCustomService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, template, context }: IMailCustomOptions) {
    this.logger.log(
      `send Mail to=${to} subject=${subject} template=${template} context=${context}`,
    );
    to = StringUtil.formatStr(to);
    subject = StringUtil.trimStr(subject);
    template = StringUtil.trimStr(template);

    if (!StringUtil.isEmailStr(to)) {
      throwCustomHttpException(CustomMessages.INVALID_FORMAT_EMAIL);
    }
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
