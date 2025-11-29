import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuditService } from '../audit.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuditGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private auditService: AuditService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-audit')
  handleSubscribe(client: Socket, payload: { tenantId?: string; filters?: any }) {
    // Join room for tenant-specific audit logs
    if (payload.tenantId) {
      client.join(`audit:${payload.tenantId}`);
    } else {
      client.join('audit:all');
    }
  }

  @SubscribeMessage('unsubscribe-audit')
  handleUnsubscribe(client: Socket) {
    client.leaveAll();
  }

  // Method to broadcast audit log (called from service)
  broadcastAuditLog(tenantId: string | undefined, log: any) {
    if (tenantId) {
      this.server.to(`audit:${tenantId}`).emit('audit-log', log);
    }
    this.server.to('audit:all').emit('audit-log', log);
  }
}

