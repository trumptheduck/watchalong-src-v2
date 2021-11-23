import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlist: any[] = [];
  private _onVideoPlay: (data:any) => any;
  constructor(private socket: Socket) {
    this.play$.subscribe({'next': (data) => {
      this._onVideoPlay(data);
    } });
  }
  public get play$():Observable<any> {
    return this.socket.fromEvent('room:playlist:play').pipe(map((data:any) => data));
  }
  public set onVideoPlay(callback:(data:any)=>any) {
    this._onVideoPlay = callback;
  }
  add(video:any,type:any) {
    this.socket.emit('room:playlist:add',{video:video,type:type});
  }
  remove(index:number) {
    if (this.playlist[index] !== null) {
      this.socket.emit('room:playlist:delete',index);
    }
  }
  swap(index1:number,index2:number) {
    if (this.playlist[index1] !== null && this.playlist[index2] !== null) {
          this.socket.emit('room:playlist:swap',{index1:index1,index2:index2});
    }
  }
  next() {
    if (this.playlist.length > 0) {
      this.socket.emit('room:playlist:next');
      this.playlist.splice(0,1);
    }
  }
}
