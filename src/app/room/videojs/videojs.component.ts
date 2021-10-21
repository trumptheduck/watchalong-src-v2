import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VideoControls } from 'src/app/core/models/videocontrols.model';
declare const videojs: any;

@Component({
  selector: 'app-videojs',
  templateUrl: './videojs.component.html',
  styleUrls: ['./videojs.component.scss']
})
export class VideojsComponent implements OnInit, AfterViewInit, VideoControls {
  @Input() width: number = 100;
  @Input() height: number = 100;
  seekTime: number = 0;
  lastTime: number = 0;
  currentTime: number = 0;
  isBuffering: boolean = false;
  checkInterval: number = 50;
  isPlayerReady:boolean = false;
  player: any;

  constructor() { }
  

  getPlayer() {
    this.player = videojs(document.getElementById('sxmvideo'));
    this.player.muted(false);
    this.player.on('timeupdate', () => {
    });
    this.isPlayerReady = true;
  }

  getDuration(player:any) {
    var seekable = player.seekable();
    return seekable && seekable.length ? seekable.end(0) - seekable.start(0) : 0;
  }

  onSeekPercentChange(player:any, seekPercent:any, duration:any) {
    var seekable = player.seekable();

    if (seekable && seekable.length) {
      // constrain currentTime
      player.currentTime(Math.max(0, Math.min(seekable.end(0), seekable.start(0) + (seekPercent * duration))));
    }
  }

  isLive() {
    if (!isFinite(this.player.duration())) {
      return true;
    }

    var acceptableDelay = 30;
    var seekable = this.player.seekable();
    return seekable && seekable.length && seekable.end(0) - this.player.currentTime() < acceptableDelay;
  }
  checkBuffering() {
    this.currentTime = this.player.currentTime()
    var offset = (this.checkInterval - 20) / 1000
    if (
            !this.isBuffering 
            && this.currentTime < (this.lastTime + offset)
            && !this.player.paused()
        ) {
        this.isBuffering = true
    }
    if (
        this.isBuffering 
        && this.currentTime > (this.lastTime + offset)
        && !this.player.paused()
        ) {
        this.isBuffering = false
    }
    this.lastTime = this.currentTime
  }
  getPlayerState() {
    if (this.player.ended()) {
      return 0
    } else if (this.player.paused()) {
      return 2
    } else if (this.isBuffering) {
      return 3
    } else {
      return 1
    }
  }
  getCurrentTime() {
    return this.player.currentTime();
  }
  seek(time:number) {
    this.player.currentTime(time);
  }
  playVideo() {
      this.player.play();
  }
  pauseVideo() {
    this.player.pause();
  }

  newVideo(src:string) {
    this.player.src({src: src});
    this.player.play();
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
  destroy() {

  }
  ngOnInit(): void {

  }
  ngAfterViewInit():void {
    this.getPlayer();
  }
}
