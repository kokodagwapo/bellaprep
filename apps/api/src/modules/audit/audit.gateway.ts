import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/audit',
})
export class AuditGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, { socket: Socket; tenantId: string }>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const tenantId = payload.tenantId;

      if (!tenantId) {
        client.disconnect();
        return;
      }

      // Store client connection
      this.connectedClients.set(client.id, { socket: client, tenantId });

      // Join tenant-specific room
      client.join(`tenant:${tenantId}`);

      console.log(`Audit client connected: ${client.id} for tenant: ${tenantId}`);
    } catch (error) {
      console.error('Audit WebSocket auth error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Audit client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { resource?: string; resourceId?: string }) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) return;

    // Subscribe to specific resource updates
    if (data.resource) {
      const room = data.resourceId 
        ? `resource:${data.resource}:${data.resourceId}`
        : `resource:${data.resource}`;
      client.join(room);
    }

    return { status: 'subscribed', data };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(client: Socket, data: { resource?: string; resourceId?: string }) {
    if (data.resource) {
      const room = data.resourceId 
        ? `resource:${data.resource}:${data.resourceId}`
        : `resource:${data.resource}`;
      client.leave(room);
    }

    return { status: 'unsubscribed', data };
  }

  broadcastAuditLog(tenantId: string, auditLog: any) {
    // Broadcast to all clients in the tenant room
    this.server.to(`tenant:${tenantId}`).emit('auditLog', auditLog);

    // Also broadcast to resource-specific rooms
    if (auditLog.resource) {
      this.server.to(`resource:${auditLog.resource}`).emit('auditLog', auditLog);
      
      if (auditLog.resourceId) {
        this.server.to(`resource:${auditLog.resource}:${auditLog.resourceId}`).emit('auditLog', auditLog);
      }
    }
  }
}

