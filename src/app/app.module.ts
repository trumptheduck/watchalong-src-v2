import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { RoomComponent } from './room/room.component';
import { JoinComponent } from './join/join.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { YoutubeComponent } from './room/youtube/youtube.component';
import { NativeComponent } from './room/native/native.component';
import { VideojsComponent } from './room/videojs/videojs.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ChatComponent } from './room/chat/chat.component';
import {MatRippleModule} from '@angular/material/core';
import { MessageComponent } from './message/message.component';
const config: SocketIoConfig = { url: environment.backend_url, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    RoomComponent,
    JoinComponent,
    HeaderComponent,
    FooterComponent,
    YoutubeComponent,
    NativeComponent,
    VideojsComponent,
    ChatComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    YouTubePlayerModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
