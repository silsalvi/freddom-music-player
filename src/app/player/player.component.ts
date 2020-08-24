import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { Subscription } from 'rxjs';
import { Brano } from '../models/brano.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  branoSelezionato: Brano;
  @Input() display: boolean;

  constructor(private braniService: BraniService) {}

  get isPlaying(): boolean {
    return this.braniService.isPlaying;
  }

  ngOnInit(): void {
    this.subscription = this.braniService.brani$.subscribe((brano) => {
      this.branoSelezionato = brano;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Handler per la riproduzione del brano
   * Stoppa o manda in play il brano selezionato
   */
  onPlayClick() {
    if (this.isPlaying) {
      this.braniService.howl.pause();
    } else {
      this.braniService.howl.play();
    }
  }

  /**
   * Handler per la selezione del brano successivo.
   * A partire dall'index del brano selezionato verifica se l'array dei risultati di ricerca sfora.
   * Se è vero allora riparte dal primo, altrimenti avanza di 1
   */
  onForwardClick() {
    const brani = this.braniService.risultatiRicerca;
    let branoSelezionato = this.braniService.branoSelezionato;
    const index = brani.findIndex((brano) => brano === branoSelezionato);
    if (index < brani.length - 1) {
      this.braniService.branoSelezionato = brani[index + 1];
    } else {
      this.braniService.branoSelezionato = brani[0];
    }
    this.braniService.riproduci(this.braniService.branoSelezionato);
  }

  /**
   * Handler per la chiusura della dialog.
   * Pone il flag mostraPlayer a false, aggiornando automaticamente tutti i riferimenti
   */
  onHide() {
    this.braniService.mostraPlayer = false;
  }

  /**
   * Handler per la selezione del brano precedente.
   * Verifica se il brano attualmente selezionato è il primo:
   * se è vero allora riprende dall'ultimo altrimenti retrocede di 1
   */
  onBackwordClick() {
    const brani = this.braniService.risultatiRicerca;
    let branoSelezionato = this.braniService.branoSelezionato;
    const index = brani.findIndex((brano) => brano === branoSelezionato);
    if (index > 0) {
      this.braniService.branoSelezionato = brani[index - 1];
    } else {
      this.braniService.branoSelezionato = brani[brani.length - 1];
    }
    this.braniService.riproduci(this.braniService.branoSelezionato);
  }
}
