import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { RicercaBraniResponse } from './models/brano.model';
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

  ngOnInit() {
    this.primeNgConfig.ripple = true;
    const brano = JSON.parse(localStorage.getItem('brano'));
    console.log(localStorage);
    const risultati: RicercaBraniResponse[] =
      JSON.parse(localStorage.getItem('risultati')) || [];

    if (brano && risultati.length > 0) {
      this.braniService.listaBrani = [...risultati];
      this.braniService.riproduci(brano, false);
    }
  }
}
