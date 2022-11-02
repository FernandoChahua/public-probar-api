import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      urlLink: process.env.DATABASE_URL_LINK,
    },
    apiKey: process.env.API_KEY,
    port: process.env.PORT,
    jwt: {
      secretCode: process.env.JWT_SECRET_CODE,
    },
    mail: {
      host: process.env.MAIL_HOST,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM,
      transport: process.env.TRANSPORT,
      port: process.env.MAIL_PORT,
    },
  };
});
