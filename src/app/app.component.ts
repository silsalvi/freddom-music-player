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
  get mostraPlayer() {
    return this.braniService.mostraPlayer;
  }
  ngOnInit() {
    this.primeNgConfig.ripple = true;
    const brano = JSON.parse(localStorage.getItem('branoCorrente'));
    const risultati: RicercaBraniResponse[] =
      JSON.parse(localStorage.getItem('risultati')) || [];
    const listaBrani: RicercaBraniResponse[] =
      JSON.parse(localStorage.getItem('listaBrani')) || [];

    const index = risultati.findIndex((song) => song.id === brano.id);
    if (risultati.length > 0) {
      this.braniService.risultatiRicerca = risultati;
    }

    if (risultati.length > 0) {
      this.braniService.listaBrani = listaBrani;
    }

    if (brano) {
      this.braniService.isRetrivedFromLocal = true;
      this.braniService.riproduci(brano, false);
      if (index > -1) {
        this.braniService.risultatiRicerca[index].selected = true;
      }
    }
  }
}
