import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './message.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from './dialogs/login-dialog/login_dialog';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hyperdb_app';

  constructor(private messageService: MessageService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LoginDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  ngOnInit(): void {
    this.messageService.addedMessage.subscribe(message => {
      this.snackBar.open(message, 'Dismiss');
    })
  }
}
