import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button'; 
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassificationComponent } from './classification/classification.component';
import { SystemsComponent } from './systems/systems.component';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input'; 
import { SystemComponent } from './system/system.component';
import { GeometriesComponent } from './geometries/geometries.component';
import { GeometryComponent } from './geometry/geometry.component';
import { BasenamePipe } from './pipes/basename';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { CommentsComponent } from './comments/comments.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { ContributorComponent } from './contributor/contributor.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DialogModule } from '@angular/cdk/dialog';
import { LoginDialog } from './dialogs/login-dialog/login_dialog';
import { ToolsComponent } from './tools/tools.component';
import { ToolComponent } from './tool/tool.component';
import { ToolVersionComponent } from './tool-version/tool-version.component';
import { MatTabsModule } from '@angular/material/tabs'; 
import { ConfiguredToolComponent } from './configured-tool/configured-tool.component';
import { NewConfiguredToolComponent } from './new-configured-tool/new-configured-tool.component';
import { CBAeroSettingComponent } from './cbaero-setting/cbaero-setting.component';
import { Cart3DSettingComponent } from './cart3d-setting/cart3d-setting.component';
import { NewCart3DSettingComponent } from './new-cart3d-setting/new-cart3d-setting.component';
import { NewCBAeroSettingComponent } from './new-cbaero-setting/new-cbaero-setting.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClassificationComponent,
    SystemsComponent,
    SystemComponent,
    GeometriesComponent,
    GeometryComponent,
    CommentsComponent,
    FileUploadComponent,
    BasenamePipe,
    ContributorsComponent,
    ContributorComponent,
    LoginDialog,
    ToolsComponent,
    ToolComponent,
    ToolVersionComponent,
    ConfiguredToolComponent,
    NewConfiguredToolComponent,
    CBAeroSettingComponent,
    Cart3DSettingComponent,
    NewCart3DSettingComponent,
    NewCBAeroSettingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    DialogModule,
    MatDialogModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatTabsModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
