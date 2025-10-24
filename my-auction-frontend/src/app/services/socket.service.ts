import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Povezan na socket ');
    });
    this.socket.on('disconnect', () => {
      console.log('Diskonektovan sa socketa');
    });
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(eventName, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(eventName);
      };
    });
  }
  joinRoom(auctionId: number): void {
    this.socket.emit('joinAuction', { auctionId }); 
    console.log(`Socket: Pridružujem se sobi za aukciju ID: ${auctionId}`);
  }

  emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }
}