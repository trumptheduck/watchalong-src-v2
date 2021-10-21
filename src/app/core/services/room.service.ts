import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { map } from 'rxjs/operators'
import { PlaylistService } from './playlist.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  userID: any = '';
  roomData: any;
  private _onReconnect: (data:any) => any = () => {};
  private _onDisconnect: () => any = () => {};
  constructor(
    private socket: Socket,
    private utils: UtilsService,
    public playlist: PlaylistService
    ) { 
      this.socket.ioSocket.io.on('reconnect',()=>{
        this.reconnect()
      })
      this.socket.fromEvent('connect')
        .subscribe({'next':()=>{
        this.reconnect()
      }})
      this.socket.fromEvent('room:reconnected')
      .subscribe({'next':(data:any)=>{
        this.update(data)
        this._onReconnect(data);
      }})
      this.socket.fromEvent('disconnect')
      .subscribe({'next':()=>{
      this._onDisconnect();
      }})
      this.socket.fromEvent('connect_error')
        .subscribe({'next':()=>{
        this._onDisconnect();
      }})
      this.roomData$.subscribe({'next': (data)=>{
        this.update(data)
      }})
      this.roomStatus$.subscribe({'next': (status)=>{
        if (status) {
          this.update(status)
        }
      }})
      this.getUserID();
      console.log(this.userID);
      if (this.userID.length < 5) {
        window.location.reload();
      }
    }

  public get roomStatus$(): Observable<any> {
    return this.socket.fromEvent("room:status").pipe(map((data:any) => data));
  }

  public get roomID(): string|null {
    return window.localStorage.getItem("roomID");
  }

  public set roomID(id:string|null) {
    if (id !== null) {
      window.localStorage.setItem("roomID",id);
    }
  }

  public get joinStatus$():Observable<boolean> {
    return this.socket.fromEvent('room:joinStatus:post').pipe(map((data:any) => data));
  }

  public get roomData$():Observable<any> {
    return this.socket.fromEvent('room:data:post').pipe(map((data:any) => data));
  }

  public set onReconnect(callback: (data:any) => any) {
    this._onReconnect = callback;
  }
  public set onDisconnect(callback: () => any) {
    this._onDisconnect = callback;
  }

  getUserID() {
    if (window.localStorage.getItem("userID") === null) {
      window.localStorage.setItem("userID",this.utils.makeId(64));
    } else {
      const currId = window.localStorage.getItem("userID");
      if (currId !== null && currId.length < 5) {
        window.localStorage.setItem("userID",this.utils.makeId(64));
      } else {
        this.userID = window.localStorage.getItem("userID");
      }
    }
  }
  requestJoinStatus() {
    this.socket.emit("room:joinStatus:get");
  }

  create(username:string) {
    this.socket.emit('room:create',username,this.userID)
  }
  join(username:string,roomID:string) {
    this.socket.emit('room:join',{
      name: username,
      roomID: roomID,
      id: this.userID
    })
  }
  leave() {
    this.socket.emit('room:disconnect');
    this.socket.disconnect();
    this.socket.connect();
    this.roomID = '';
  }

  private reconnect() {
    this.socket.emit('room:reconnect',this.userID,this.roomID);
    this.requestJoinStatus()
  }
  private update(data:any) {
    this.roomData = data;
    this.playlist.playlist = data.playlist;
  }
 
  updateUserData(time: any, status: any) {
    this.socket.emit("room:data:update",time,status);
  }
}
