import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hyperdb_app';

  constructor(private messageService: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.messageService.addedMessage.subscribe(message => {
      this.snackBar.open(message, 'Dismiss');
    })
  }
}
