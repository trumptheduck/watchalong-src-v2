import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomService } from '../core/services/room.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<any> = new ReplaySubject(1);

  username: string = '';
  roomcode: string = '';
  constructor(
    private Route: ActivatedRoute,
    private Router: Router,
    private Room: RoomService
  ) {
    this.Route.queryParams.subscribe({'next' : (params:any) => {
      if (params.room === undefined) {
        this.Router.navigate(['home']);
      } else {
        this.roomcode = params.room;
      }
    }})
    this.Room.roomStatus$.pipe(takeUntil(this.destroyed$))
    .subscribe({'next': (status) => {
      console.log(status);
      if (status) {
        window.location.href = window.location.protocol + '//' + window.location.host + '/room'
      } 
    }})
   }
  ngOnInit(): void {
  }
  join() {
    this.Room.roomID = this.roomcode;
    this.Room.join(this.username,this.roomcode);
  }
  ngOnDestroy() {
    this.destroyed$.next();
  }
}
