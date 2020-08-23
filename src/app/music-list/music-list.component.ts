import { Component, OnInit } from '@angular/core';
import { Brano } from '../models/brano.model';
@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css'],
})
export class MusicListComponent implements OnInit {
  branoSelezionato: Brano;
  brani: Brano[] = [
    {
      durata: 500,
      nome: 'Tik tok',
      path: '',
    },
    {
      durata: 500,
      nome: 'Fear of the dark',
      path: '',
    },
    {
      durata: 500,
      nome: 'Bohemian Rhapsody',
      path: '',
    },
  ];
  constructor() {}

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
