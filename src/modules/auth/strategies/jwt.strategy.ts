import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from '../../../config-env/config';
import { CustomMessages } from '../../../shared/exception/custom-messages';
import { throwCustomHttpException } from '../../../shared/exception/throw-custom-exception';
import { AuthRepository } from '../auth.repository';
import { UserStatus } from '../entities/user.entity';
import { IJwtPayload } from '../jwt-payload.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.secretCode,
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;

    const user = await this._authRepository.findOne({
      where: {
        username,
        status: UserStatus.ACTIVE,
      },
    });
    if (!user) {
      throwCustomHttpException(CustomMessages.USER_NOT_EXIST);
    }

    return payload;
  }
}
