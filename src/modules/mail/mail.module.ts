/* eslint-disable require-await */

import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailerCustomService } from './mailer-custom.service';

import { ConfigType } from '@nestjs/config';
import config from '../../config-env/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => ({
        transport: {
          host: configService.mail.host,
          port: parseInt(configService.mail.port, 10),
          secure: false,
          auth: {
            user: configService.mail.user,
            pass: configService.mail.password,
          },
        },
        defaults: {
          from: `Fernando Chahua <${configService.mail.from}>`,
        },
        template: {
          // defaultLayout:'',
          dir: join(process.cwd(), '/dist/mail/templates/emails'),
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssEnabled: true,
            inlineCssOptions: {
              url: ' ',
              preserveMediaQueries: true,
            },
          }),
          options: {
            strict: true,
          },
        },
        previe: true,
        options: {
          partials: {
            dir: join(process.cwd(), '/dist/mail/templates/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  providers: [MailService, MailerCustomService],
  exports: [MailService, MailerCustomService],
})
export class MailModule {}
