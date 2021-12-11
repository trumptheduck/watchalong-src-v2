import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../core/models/message.model';
import { MessageService } from '../core/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {
  @ViewChild('chatContainer') container:ElementRef;
  isReady:boolean = false;
  userMessage:string = '';
  constructor(
    public messageService: MessageService
  ) { 
    this.messageService.onReceiveMessage = () => {
      this.scrollToBottom();
    }
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.isReady = true;
  }
  scrollToBottom():void {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
  sendMessage():void {
    if (this.userMessage !== '') {
      this.messageService.sendMessage(this.userMessage)
      this.userMessage = '';
      this.scrollToBottom();
    }
  }
}
