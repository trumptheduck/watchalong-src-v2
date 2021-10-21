import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeGuard } from './core/guards/home.guard';
import { RoomGuard } from './core/guards/room.guard';
import { HomeComponent } from './home/home.component';
import { JoinComponent } from './join/join.component';
import { LayoutComponent } from './layout/layout.component';
import { RoomComponent } from './room/room.component';
import { YoutubeComponent } from './room/youtube/youtube.component';

const routes: Routes = [
  {
    path: "home",
    component: LayoutComponent,
    canActivate: [HomeGuard],
    children: [
      {
        path: "",
        component: HomeComponent,
        canActivate: [HomeGuard],
      },
      {
        path: "join",
        component: JoinComponent,
        canActivate: [HomeGuard],
      }
    ]
  },
  {
    path: "room",
    component: RoomComponent,
    canActivate: [RoomGuard],
    canActivateChild: [RoomGuard],
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    HomeGuard,
    RoomGuard
  ]
})
export class AppRoutingModule { }
