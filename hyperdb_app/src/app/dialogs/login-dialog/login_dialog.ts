import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HyperdbService } from '../../hyperdb.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'login-dialog',
    templateUrl: 'login-dialog.html',
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

    constructor(public dialogRef: MatDialogRef<LoginDialog>, private hyperdbService: HyperdbService) {
        this.loginForm.reset();
    }

    login(): void {
        let fileFormData = new FormData();
        fileFormData.append("username", this.emailControl.value == null ? '': this.emailControl.value);
        fileFormData.append("password", this.passwordControl.value == null ? '': this.passwordControl.value);
        this.hyperdbService.login(fileFormData).subscribe(response => {
            let access_token = response['access_token'];
        })
    }
  }
  