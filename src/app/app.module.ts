import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicListComponent } from './music-list/music-list.component';
import { DataViewModule } from 'primeng/dataview';
import { RippleModule } from 'primeng/ripple';
import { MenubarModule } from 'primeng/menubar';
import { MenubarComponent } from './menubar/menubar.component';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PlayerComponent } from './player/player.component';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FreedomInterceptor } from './services/http-interceptor';
import { ModalComponent } from './modal/modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  ContextMenuModule,
  MessageModule,
  MessageService,
  MessagesModule,
  ToastModule,
} from 'primeng';
@NgModule({
  declarations: [
    AppComponent,
    MusicListComponent,
    MenubarComponent,
    PlayerComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DataViewModule,
    RippleModule,
    MenubarModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    NgxSpinnerModule,
    SliderModule,
    TooltipModule,
    HttpClientModule,
    RadioButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    ContextMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FreedomInterceptor,
      multi: true,
    },
    DialogService,
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
