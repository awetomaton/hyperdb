import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from './dialogs/login-dialog/login_dialog';
import { ContributorService } from './services/contributor.service';
import { HttpHeaders } from '@angular/common/http';
import { HyperdbService } from './services/hyperdb.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hyperdb_app';

  constructor(
    private messageService: MessageService, 
    private hyperdbService: HyperdbService, 
    private snackBar: MatSnackBar, 
    public dialog: MatDialog,
    public contributorService: ContributorService) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(LoginDialog, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  ngOnInit(): void {
    this.messageService.addedMessage.subscribe(message => {
      this.snackBar.open(message, 'Dismiss');
    })

    if (true) { // Login as fixture user for faster dev
      let fileFormData = new FormData();
      fileFormData.append("username", "hyperhub@hyperdb.com");
      fileFormData.append("password", "password");
      this.hyperdbService.login(fileFormData).subscribe(response => {
          let access_token = response['access_token'];
          const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  Authorization: 'Bearer ' + access_token
              })
          };
          this.hyperdbService.httpOptions = httpOptions;
          this.hyperdbService.me().subscribe(me => {
              this.contributorService.contributor = me;
          })
      })
    }
  }
}
