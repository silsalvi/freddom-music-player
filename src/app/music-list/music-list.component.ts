import { Component, OnInit } from '@angular/core';
import { Brano } from '../models/brano.model';
import { brani } from '../mock-data';
import { BraniService } from '../services/brani.service';
@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css'],
})
export class MusicListComponent implements OnInit {
  branoSelezionato: Brano;

  /**
   * Ritorna i risultati delle ricerche dal service
   */
  get risultatiRicerca() {
    return this.braniService.risultatiRicerca;
  }
  constructor(private braniService: BraniService) {}

  ngOnInit(): void {}

  /**
   * Handler per l'evento di selezione di un brano.
   * Ferma o riproduce il brano se quest'ultimo era già in riproduzione o meno.
   * @todo implementare insieme a ricerca
   */
  onSelection(brano: Brano) {
    console.log(brano);
  }
}
