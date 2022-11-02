import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RealtimeService {
  private socket: Server;

  public saveSocket = (socket: Server) => (this.socket = socket);

  emitToUser<T>(
    userId: number,
    rtEvent: string,
    payload: T & { event: string },
  ) {
    if (!userId) return;
    this.socket?.to(`user-${userId}`).emit(rtEvent, { userId, ...payload });
  }

  emitToRoom<T>(room: string, rtEvent: string, payload: T & { event: string }) {
    if (!room) return;
    this.socket?.to(`${room}`).emit(rtEvent, { ...payload });
  }

  joinUserToRoom(userId: number, room: string) {
    if (!userId || !room) return;
    this.socket?.in(`user-${userId}`).socketsJoin(room);
  }

  leaveUserFromRoom(userId: number, room: string) {
    if (!userId || !room) return;
    this.socket?.in(`user-${userId}`).socketsLeave(room);
  }

  leaveAllUsersFromRoom(room: string) {
    if (!room) return;
    this.socket.in(room).socketsLeave(room);
  }
}
