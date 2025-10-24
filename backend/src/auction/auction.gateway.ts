import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AuctionGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinAuction')
  handleJoinAuction(client: Socket, payload: { auctionId: number }): void {
    const roomName = `auction:${payload.auctionId}`;
    client.join(roomName);
    console.log(`Klijent ${client.id} u sobi: ${roomName}`);
  }
}
