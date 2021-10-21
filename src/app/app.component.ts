import { Component } from '@angular/core';
import { RoomService } from './core/services/room.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  constructor(
    private Room: RoomService
  ) {
  }
  
}
