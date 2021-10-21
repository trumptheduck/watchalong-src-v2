export interface VideoControls {
  player:any;
  isPlayerReady: boolean;
  getPlayer(event:any):any;
  newVideo(src:string):any;
  playVideo():any;
  pauseVideo():any;
  getPlayerState():any;
  seek(time: number):any;
  getCurrentTime():any;
  destroy():any;
  heartbeat():any;
  initialize(data:any,callback1:any,callback2:any):any;
}