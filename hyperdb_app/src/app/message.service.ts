import { Injectable, EventEmitter, Output } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];
  @Output() addedMessage = new EventEmitter<string>();

  add(message: string) {
    this.messages.push(message);
    this.addedMessage.emit(message)
  }

  clear() {
    this.messages = [];
  }
}