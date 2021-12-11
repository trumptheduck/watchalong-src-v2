import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../models/message.model';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageArray: Message[] = [];
  constructor(
    private socket: Socket,
    private roomService: RoomService
    ) {
      this.socket.fromEvent('message:receive').subscribe({'next':(message)=>{
        var castedMessage = message as Message;
        this._addMessage(castedMessage);
        this._onReceiveMessage();
      }})
    }
  set onReceiveMessage(callback: ()=>void) {
    this._onReceiveMessage = callback;
  }
  sendMessage(message:string):void {
    this.socket.emit('message:send',message);
    this.messageArray.push({
      name: this.roomService.username,
      content: message,
      isSelf: true
    })
  }
  private _addMessage(message: Message) {
    this.messageArray.push(message);
  }
  private _onReceiveMessage():void {

  }
}
