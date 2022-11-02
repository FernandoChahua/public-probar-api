import {
  GatewayMetadata,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../modules/auth/auth.service';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { RealtimeService } from './realtime.service';

@WebSocketGateway(<GatewayMetadata>{
  transports: ['websocket'],
  cors: {
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new CustomLoggerService(RealtimeGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly realtimeService: RealtimeService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Websocket connection on ${server.path()}`);
    this.realtimeService.saveSocket(server);
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.authService.getUserFromSocket(socket);
      /// Join user to his own room
      socket.join(`user-${user.id}`);

      // Join users to general room
      this.realtimeService.joinUserToRoom(user.id, 'general');

      this.logger.log({ msg: 'User connected', userId: user.id });
    } catch (error) {
      this.logger.error('handleConnection() failed', error);
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.logger.log({ msg: 'User disconnected', userId: user.id });
    } catch (error) {
      this.logger.error('handleDisconnect() failed', error);
      socket.disconnect();
    }
  }

  @SubscribeMessage('hi')
  async handleHi(socket: Socket, payload: any) {
    try {
      const user = await this.authService.getUserFromSocket(socket);
      this.realtimeService.emitToUser(user.id, 'message', {
        event: 'Hi',
        username: user.username,
      });
    } catch (error) {
      this.logger.error({ msg: 'handleMessageRead() failed', payload }, error);
    }

    return { success: false };
  }
}
