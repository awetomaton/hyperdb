import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HyperdbService } from '../../hyperdb.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import { ContributorService } from 'src/app/contributor.service';


@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.html',
    styleUrls: [
        '../../app.component.scss',
      ]
  })
  export class LoginDialog {
    emailControl = new FormControl('email', [
        Validators.required,
    ])
    passwordControl = new FormControl('password', [
        Validators.required,
    ])
    loginForm = new FormGroup({
        email: this.emailControl,
        password: this.passwordControl,
    })

    constructor(
        public dialogRef: MatDialogRef<LoginDialog>, 
        private hyperdbService: HyperdbService, 
        private contributorService: ContributorService) {
        this.loginForm.reset();
    }

    login(): void {
        let fileFormData = new FormData();
        fileFormData.append("username", this.emailControl.value == null ? '': this.emailControl.value);
        fileFormData.append("password", this.passwordControl.value == null ? '': this.passwordControl.value);
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
                this.dialogRef.close();
            })
        })
    }
  }
  