import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomService } from '../core/services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string = '';
  roomcode: string = '';
  isInvalid: boolean = false;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private Room: RoomService,
    private Router: Router
  ) {
    this.Room.roomStatus$.pipe(takeUntil(this.destroyed$))
    .subscribe({'next': (status) => {
      if (status) {
        this.isInvalid = false;
        this.Room.roomID = status.id;
        window.location.href = window.location.protocol + '//' + window.location.host + '/room'
      } else {
        this.isInvalid = true;
      }
    }})
   }

  ngOnInit(): void {
  }
  createNewRoom() {
    this.Room.create(this.username);
  }
  joinExistingRoom() {
    this.Room.roomID = this.roomcode;
    this.Room.join(this.username,this.roomcode);
  }
}
