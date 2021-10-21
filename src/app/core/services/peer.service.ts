import { Injectable } from '@angular/core';
import * as Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  peer:Peer;
  peerID: string;
  isReady: boolean = false;
  isConnected: boolean = false;
  connections: Peer.DataConnection[] = [];
  constructor() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      this.peerID = id;
      this.isReady = true;
      this.peer.on('connection',(conn)=> {
        this.connections.push(conn);
      })
    });
  }
  initialize() {
    this.peer = new Peer();
  }
}
