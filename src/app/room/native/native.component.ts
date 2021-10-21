import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VideoControls } from 'src/app/core/models/videocontrols.model';

@Component({
  selector: 'app-native',
  templateUrl: './native.component.html',
  styleUrls: ['./native.component.scss']
})
export class NativeComponent implements OnInit, AfterViewInit, VideoControls {
  @Input() width: number = 100;
  @Input() height: number = 100;

  player: any;
  bufferInterval: any;
  lastTime: number = 0;
  currentTime: number = 0;
  isBuffering: boolean = false;
  checkInterval: number = 50;
  isPlayerReady = false;
  isConnected = false;
  loadedInterval:any;
  constructor() {
  }
  getPlayer(player: any) {
    this.player = player;
    if (this.player !== null) {
      this.isPlayerReady = true;
      this.bufferInterval = setInterval(()=>{this.checkBuffering()},this.checkInterval);
    }
    console.log(this);
  }
  newVideo(src:string) {
    this.player.src = src;
    this.player.play()
  }
  playVideo() {
    this.player.play()
  }
  pauseVideo() {
    this.player.pause()
  }
  getPlayerState() {
    if (this.player.paused) {
      return 2
    } else if (this.isBuffering) {
      return 3
    } else {
      return 1
    }
  }
  seek(time: number) {
    this.player.currentTime = time;
  }
  checkBuffering() {
    this.currentTime = this.player.currentTime
    var offset = (this.checkInterval - 20) / 1000
    if (
            !this.isBuffering 
            && this.currentTime < (this.lastTime + offset)
            && !this.player.paused
        ) {
        this.isBuffering = true
    }
    if (
        this.isBuffering 
        && this.currentTime > (this.lastTime + offset)
        && !this.player.paused
        ) {
        this.isBuffering = false
    }
    this.lastTime = this.currentTime
  }
  getCurrentTime() {
    if (this.player.currentTime !== null) {
      return this.player.currentTime;
    } else {
      return 0;
    }
  }
  destroy() {
    clearInterval(this.checkInterval);
  }
  heartbeat() {
    
  }
  initialize(data:any,callback1:any,callback2:any) {
    if (this.isPlayerReady) {
      this.newVideo(data.nowPlaying.video.url);
      var loop = setInterval(()=>{
        if (data.host.time === this.getCurrentTime()) {
          clearInterval(loop);
          callback2();
        } else {
          this.seek(data.host.time);
        }
      },500)
      callback1();
    }
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.getPlayer(document.getElementById('native-player'));
  }
  
}
