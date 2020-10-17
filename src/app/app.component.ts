import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { BraniService } from './services/brani.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  constructor(
    private primeNgConfig: PrimeNGConfig,
    private braniService: BraniService
  ) {}

  get isPlaying() {
    return this.braniService.isPlaying;
  }
  get mostraPlayer() {
    return this.braniService.mostraPlayer;
  }
  ngOnInit() {
    this.primeNgConfig.ripple = true;
  }
}
