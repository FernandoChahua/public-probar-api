/* eslint-disable require-await */
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config-env/config';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [],
    inject: [config.KEY],
    async useFactory(configService: ConfigType<typeof config>) {
      console.log(process.cwd());
      let config: any = {
        host: configService.database.host,
        username: configService.database.user,
        password: configService.database.password,
        database: configService.database.name,
        ssl: false,
      };
      if (process.env.NODE_ENV === 'production')
        config = {
          url: 'postgres://unmfmdnkjqpjra:1165a5236367667edac5780d917ca023a30780bdc596b77290d37ae1deb214a5@ec2-18-208-55-135.compute-1.amazonaws.com:5432/d22kk0neaov5vk',
          ssl: {
            rejectUnauthorized: false,
          },
        };
      return {
        type: 'postgres',
        ...config,
        entities: [`${process.cwd()}/dist/**/**/*.entity{.ts,.js}`],
        migrations: [`${process.cwd()}/dist/database/migrations/*{.ts,.js}`],
        logger: 'advanced-console',
        logging: true,
      } as ConnectionOptions;
    },
  }),
];
