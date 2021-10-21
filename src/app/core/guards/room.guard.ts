import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RoomService } from "../services/room.service";

@Injectable()
export class RoomGuard implements CanActivate, CanActivateChild {
  joinStatus: boolean = false;
  constructor(
    private Room: RoomService,
    private Router: Router,
  ) {

   }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    this.Room.requestJoinStatus();
    return this.Room.joinStatus$.pipe(map(status => {
      if (status) {
        return true;
      } else {
        this.Router.navigate(['home']);
        return false;
      }
    }))
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}