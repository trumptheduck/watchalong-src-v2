import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VideoControls } from '../core/models/videocontrols.model';
import { NhdService } from '../core/services/nhd.service';
import { PlaylistService } from '../core/services/playlist.service';
import { RoomService } from '../core/services/room.service';
import { YTService } from '../core/services/yt.service';
import { NativeComponent } from './native/native.component';
import { VideojsComponent } from './videojs/videojs.component';
import { YoutubeComponent } from './youtube/youtube.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy, AfterViewInit {
  //Hook
  @ViewChild('youtubePlayer')
  youtubePlayer: YoutubeComponent;
  @ViewChild('nativePlayer')
  nativePlayer: NativeComponent;
  @ViewChild('videojsPlayer')
  videojsPlayer: VideojsComponent;
  /////////////////////
  heartbeat: any;
  beat:number = 500;
  Math: Math = Math;
  inviteURL:string = environment.backend_url + "/home/join?room=" + this.Room.roomID;
  searchQuery: string = '';
  provider: string = "Youtube"
  videoURL: string = "";
  players:VideoControls[] = [];
  playerIndex: number = 0;
  viewportWidth: number = 0;
  isAfterViewInit: boolean = false;
  isConnected: boolean = false;
  isFollowingHost: boolean = true;
  ////////////////////////////
  playlistManager: PlaylistManager = new PlaylistManager(this,this.Room.playlist);
  private destroyed$: ReplaySubject<any> = new ReplaySubject(1);
  constructor(
    public Room: RoomService,
    private Router: Router,
    public YT: YTService,
    public NHD: NhdService,
    private snackbar: MatSnackBar
  ) { 
    this.Room.onDisconnect = () => {
      clearInterval(this.heartbeat);
      this.Router.navigate(["home"]);
    }
    const reconnectLoop = setInterval(()=>{
      if (this.Room.roomData.nowPlaying === null||this.Room.roomData?.nowPlaying?.video === undefined) {
        clearInterval(reconnectLoop);
        this.isConnected = true;
      } else {
        if (this.isAfterViewInit) {
          this.getPlayer(this.Room.roomData.nowPlaying);
          this.currentPlayer.initialize(this.Room.roomData,
            ()=>{
              clearInterval(reconnectLoop);
            },
            ()=>{
            this.isConnected = true;
          })
        }
      }
    },this.beat);
    this.viewportWidth = window.innerWidth;
  }

  public get currentPlayer() {
    return this.players[this.playerIndex];
  }  

  copyInvite() {
    navigator.clipboard.writeText(this.inviteURL);
  }
  leaveRoom():void {
    this.Room.leave();
  }
  getStatus(code:number):string {
    switch (code) {
      case -1:
      return "Ch??a b???t ?????u"
      case 0:
      return "K???t th??c"
      case 1:
      return "??ang ph??t"
      case 2:
      return "T???m d???ng"
      case 3:
      return "??ang load"
      case 5: 
      return "?????i video"
      default: return "Kh??ng r??"
    }
  }
  addYTVideo(url:string) {
    this.YT.getVideoData(this.YT.getVideoIdFromUrl(url))
    .subscribe({'next':(data)=>{
      if (data?.title !== undefined) {
        this.openSnack('Th??m video th??nh c???ng!');
        this.playlistManager.add(data,'youtube');
      } else {
        this.openSnack('Link kh??ng h???p l???');
      }
    }})
  }
  addYTVideoByID(id:string) {
    this.YT.getVideoData(id)
    .subscribe({'next':(data)=>{
      if (data?.title !== undefined) {
        this.openSnack('Th??m video th??nh c???ng!');
        this.playlistManager.add(data,'youtube');
      } else {
        this.openSnack('Link kh??ng h???p l???');
      }
    }})
  }
  addNHDVideo(url:string) {
    if (url.search('nguonhd')!==-1) {
      this.openSnack('??ang l???y video, vui l??ng ?????i 30s!');
      this.NHD.getData(url).subscribe({'next':(data)=> {
        this.openSnack('Th??m video th??nh c???ng!');
        this.playlistManager.add({
          title: data.title,
          thumbnail_url: data.image,
          url: data.url,
          author_name: "Ngu???n HD"
        },data.type)
      }, 'error': ()=>{
        this.openSnack('Server Ngu???n HD kh??ng ph???n h???i, link c?? th??? ???? die');
      }})
    } else {
      this.openSnack('Link kh??ng h???p l???');
    }
  }
  openSnack(msg:string) {
    this.snackbar.open(msg, '', {
      duration: 1000
    });
  }
  addVideo(provider:string,url:string) {
    if (url !== '') {
      if (url === this.videoURL) {
        this.videoURL = "";
      }
      switch (provider) {
      case 'Youtube':
        this.addYTVideo(url);
        break;
      case "NguonHD":
        this.addNHDVideo(url); 
        break;
      default: return;
      }
    } 
  }
  getPlayer(data:any) {
    if (data === null|| data?.type === undefined) return;
    switch (data.type) {
      case 'youtube':
        this.playerIndex = 0;
        break;
      case 'mp4':
        this.playerIndex = 1;
        break;
      case 'm3u8':
        this.playerIndex = 2;
        break;
      default: return;
    }
  }
  ngOnInit(): void {
    this.heartbeat = setInterval(()=>{
      if (this.isConnected) {
          this.Room.updateUserData(Math.floor(this.currentPlayer.getCurrentTime()),this.currentPlayer.getPlayerState());
          if (this.isFollowingHost&&this.Room.roomData.host.id !== this.Room.userID) {
            if (Math.abs(this.Room.roomData.host.time - this.currentPlayer.getCurrentTime()) >= 5) {
              this.currentPlayer.seek(this.Room.roomData.host.time);
            }
            if (this.Room.roomData.host.status !== this.currentPlayer.getPlayerState()) {
              if (this.Room.roomData.host.status === 1) {
                this.currentPlayer.playVideo();
              } else {
                this.currentPlayer.pauseVideo();
              }
            }
          }
      }
    },this.beat);
  }
  ngOnDestroy() {
    clearInterval(this.heartbeat);
  }
  ngAfterViewInit() {
    this.players = [this.youtubePlayer,this.nativePlayer,this.videojsPlayer];
    this.isAfterViewInit = true;
  }
}
class PlaylistManager {
  constructor(private component: RoomComponent,private Playlist: PlaylistService) {
    Playlist.onVideoPlay = (data) => {
      this.play(data);
    }
  }
  add(video:any,type:string) {
    this.Playlist.add(video,type);
  }
  next() {
    this.play(this.Playlist.playlist[0]);
    this.Playlist.next();
  }
  play(data:any) {
    console.log("Play")
    this.component.getPlayer(data);
    this.component.players.forEach(player=> {
      player.pauseVideo();
    })
    this.component.currentPlayer.newVideo(data.video.url);
  }
}