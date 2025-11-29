import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

// In-memory connection store (for Lambda, use DynamoDB in production)
const connections: Set<string> = new Set();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  const { requestContext, body } = event;
  const connectionId = requestContext.connectionId!;
  const routeKey = requestContext.routeKey;
  
  console.log(`WebSocket ${routeKey}: ${connectionId}`);
  
  switch (routeKey) {
    case '$connect':
      connections.add(connectionId);
      console.log(`Client connected: ${connectionId}`);
      return { statusCode: 200, body: 'Connected' };
      
    case '$disconnect':
      connections.delete(connectionId);
      console.log(`Client disconnected: ${connectionId}`);
      return { statusCode: 200, body: 'Disconnected' };
      
    case '$default':
      if (body) {
        try {
          const message = JSON.parse(body);
          console.log('Received message:', message);
          
          // Handle different message types
          switch (message.type) {
            case 'ping':
              await sendToConnection(event, connectionId, { type: 'pong' });
              break;
              
            case 'subscribe':
              // Handle subscription to audit events, loan updates, etc.
              await sendToConnection(event, connectionId, { 
                type: 'subscribed', 
                channel: message.channel 
              });
              break;
              
            default:
              await sendToConnection(event, connectionId, { 
                type: 'error', 
                message: 'Unknown message type' 
              });
          }
        } catch (error) {
          console.error('Error processing message:', error);
          await sendToConnection(event, connectionId, { 
            type: 'error', 
            message: 'Invalid message format' 
          });
        }
      }
      return { statusCode: 200, body: 'OK' };
      
    default:
      return { statusCode: 400, body: 'Unknown route' };
  }
};

async function sendToConnection(
  event: APIGatewayProxyEvent, 
  connectionId: string, 
  data: any
): Promise<void> {
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  
  const client = new ApiGatewayManagementApiClient({
    endpoint: `https://${domain}/${stage}`,
  });
  
  try {
    await client.send(new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: Buffer.from(JSON.stringify(data)),
    }));
  } catch (error: any) {
    if (error.statusCode === 410) {
      // Connection is stale, remove it
      connections.delete(connectionId);
    } else {
      throw error;
    }
  }
}

// Utility to broadcast to all connections
export async function broadcast(
  event: APIGatewayProxyEvent, 
  data: any, 
  exclude?: string
): Promise<void> {
  const promises = Array.from(connections)
    .filter(id => id !== exclude)
    .map(id => sendToConnection(event, id, data));
  
  await Promise.all(promises);
}

