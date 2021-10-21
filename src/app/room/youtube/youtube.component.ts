import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { VideoControls } from 'src/app/core/models/videocontrols.model';
import { YTService } from 'src/app/core/services/yt.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit,AfterViewInit,VideoControls {
  @Input() width: number = 100;
  @Input() height: number = 100;
  @Input() videoURL: string = '';
  player:any;
  isPlayerReady: boolean = false;
  constructor(public YT: YTService) { }
  getPlayer(event:any) {
    this.player = event.target;
    this.isPlayerReady = true;
  }
  newVideo(src:string) {
    if (this.isPlayerReady) {
      var id = this.YT.getVideoIdFromUrl(src);
      this.player.loadVideoById(id)
      this.playVideo();
    }
  }
  playVideo() {
    this.player.playVideo()
  }
  pauseVideo() {
    this.player.pauseVideo()
  }
  getPlayerState() {
    if (this.isPlayerReady) {
      return this.player.getPlayerState()
    } else {
      return -1
    }
  }
  seek(time: number) {
    this.player.seekTo(time);
  }
  
  getCurrentTime() {
    if (this.isPlayerReady) {
      return this.player.getCurrentTime();
    } else {
      return 0
    }
  }
  destroy() {

  }
  heartbeat() {
    
  }
  initialize(data:any,callback1:any,callback2:any) {
    if (this.isPlayerReady&&data.nowPlaying?.video !== undefined) {
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
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  ngAfterViewInit():void {
  }
}
