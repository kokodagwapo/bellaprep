import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/audit',
})
export class AuditGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuditGateway.name);

  handleConnection(client: Socket) {
    this.logger.log('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected: ' + client.id);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, tenantId: string) {
    client.join('tenant:' + tenantId);
    this.logger.log('Client ' + client.id + ' subscribed to tenant ' + tenantId);
    return { event: 'subscribed', data: { tenantId } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, tenantId: string) {
    client.leave('tenant:' + tenantId);
    this.logger.log('Client ' + client.id + ' unsubscribed from tenant ' + tenantId);
    return { event: 'unsubscribed', data: { tenantId } };
  }

  emitAuditEvent(tenantId: string, event: any) {
    this.server.to('tenant:' + tenantId).emit('audit', event);
  }
}
