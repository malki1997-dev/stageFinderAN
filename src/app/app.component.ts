import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from './shared/shared.module';
import { HeaderAdminComponent } from "./features/header&footer/header-admin/header-admin.component";
import { FooterComponent } from './features/header&footer/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    SharedModule,
    HeaderAdminComponent,
    FooterComponent,
    RouterOutlet,
    FileUploadModule,
    InputTextModule
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  visible: boolean = false;
}
