import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { isArray } from 'class-validator';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto, RefreshTokenDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';
import { CustomMessages } from '../../shared/exception/custom-messages';
import { throwCustomHttpException } from '../../shared/exception/throw-custom-exception';
import { CustomLoggerService } from '../../shared/logger/custom-logger.service';
import { Role, User, UserStatus } from './entities/user.entity';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import config from '../../config-env/config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthService {
  readonly BEARER_LENGHT_START_STRING = 7;

  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger = new CustomLoggerService(AuthService.name);
  }

  async signup(signupDto: SignupDto): Promise<void> {
    const { username } = signupDto;

    const usernameExist = await this._authRepository.findOne({
      where: [{ username, status: UserStatus.ACTIVE }],
    });

    if (usernameExist) {
      this.logger.debug(
        `User ${usernameExist.id} is found by username ${usernameExist.username}.`,
      );

      throw new HttpException(
        'Ya existe una cuenta con ese correo.',
        HttpStatus.CONFLICT,
      );
    }

    return this._authRepository.signup(signupDto);
  }

  async signin(
    signinDto: SigninDto,
  ): Promise<{ token: string; refreshToken: string }> {
    const { password, username } = signinDto;
    const user = await this.validExistUser({
      username,
    });

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'La contraseña es incorrecta.',
        HttpStatus.CONFLICT,
      );
    }

    const payload: IJwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as Role,
    };

    const token = await this._jwtService.sign(payload);
    const refreshToken = await this.getRefreshToken(payload);

    return { token, refreshToken };
  }

  private getRefreshToken(payload: IJwtPayload) {
    const refreshToken = this._jwtService.sign(payload, {
      secret: this.configService.jwt.secretCode,
      expiresIn: '9999 years',
    });

    return refreshToken;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { token, refreshToken } = refreshTokenDto;
    const jwtContent: IJwtPayload = this._jwtService.decode(
      token,
    ) as IJwtPayload;
    if (!jwtContent) {
      this.logger.log('Error getting token');
      throw new HttpException('El token es inválido.', HttpStatus.CONFLICT);
    }
    const { id } = jwtContent;
    const user = await this._authRepository.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });

    if (!user) {
      throwCustomHttpException(CustomMessages.USER_NOT_EXIST);
    }
    await this.validateRefreshToken(refreshToken);

    const payload: IJwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as Role,
    };

    const newToken = this._jwtService.sign(payload);

    return {
      token: newToken,
      refreshToken,
    };
  }

  private async validateRefreshToken(token: string) {
    try {
      await this._jwtService.verify(token, {
        secret: this.configService.jwt.secretCode,
      });
    } catch (error) {
      throw new HttpException('Refresh token expirado.', HttpStatus.CONFLICT);
    }
  }

  private async validExistUser({ username }): Promise<User> {
    const user = await this._authRepository.findOne({
      where: [
        {
          username,
          status: UserStatus.ACTIVE,
        },
      ],
    });

    if (!user) {
      throw new HttpException(
        'El usuario no esta registrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserFromSocket(socket: Socket): Promise<IJwtPayload> {
    const payload = await this.decodeJwtFromSocket(socket);
    const { id: userId } = payload;
    const exists = await this._authRepository.findOne(userId, {
      select: ['id'],
    });
    if (!exists) {
      throw new WsException(`User ${userId} does not exists`);
    }

    return payload;
  }

  async decodeJwtFromRequest(req: Request): Promise<IJwtPayload> {
    let token = req.header('Authorization');

    if (!token) {
      this.logger.debug(`Token is not Found..... -> token=${token}`);
      return null;
    }

    token = token.substring(this.BEARER_LENGHT_START_STRING);

    this.logger.debug(`Decoding..... -> token=${token}`);

    try {
      await this._jwtService.verify(token, {
        secret: this.configService.jwt.secretCode,
      });
    } catch (error) {
      throw new HttpException('Token expirado.', HttpStatus.CONFLICT);
    }

    try {
      const payload = this._jwtService.decode(token) as IJwtPayload;
      this.logger.debug(
        `Decoded Successfully ..... -> token=${token} payload=${JSON.stringify(
          payload,
        )}`,
      );
      return payload;
    } catch (error) {
      throw new HttpException('Token Inválido.', HttpStatus.CONFLICT);
    }
  }

  // eslint-disable-next-line require-await
  private async decodeJwtFromSocket(socket: Socket): Promise<IJwtPayload> {
    try {
      const jwtToken = this.getJWTFromQuery(socket);
      const jwtContent = this._jwtService.decode(jwtToken);
      if (!jwtToken || !jwtContent) {
        this.logger.log({
          msg: 'websocket-connection',
          handshake: socket?.handshake,
        });
      }

      return jwtContent as IJwtPayload;
    } catch (error) {
      this.logger.error(
        { msg: 'socket-handshake', handshake: socket?.handshake },
        error,
      );

      return null;
    }
  }

  private getJWTFromQuery(socket: Socket): string {
    const token = this.parseParam(socket?.handshake?.auth?.token ?? '');

    return token;
  }

  private parseParam(param: string | string[]): string {
    return isArray(param) ? param[0] : (param as string);
  }

  public getUserById(userId: number) {
    return this._authRepository.findOne({ id: userId });
  }
}
