import { Howl } from 'howler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { RicercaBraniResponse } from '../models/brano.model';
import { trigger, style, transition, animate } from '@angular/animations';

declare var $: any;
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class PlayerComponent implements OnInit {
  branoSelezionato: RicercaBraniResponse;
  fullMode: boolean;
  tempo: number;
  attuale: string;
  durata: string;
  constructor(private braniService: BraniService) {}

  get howl(): Howl {
    return this.braniService.howl;
  }
  get isPlaying(): boolean {
    return this.braniService.isPlaying;
  }

  ngOnInit(): void {
    this.braniService.brani$.subscribe((brano) => {
      this.branoSelezionato = brano;
      this.startPlay();
    });
  }

  /**
   * Handler per la riproduzione del brano
   * Stoppa o manda in play il brano selezionato
   */
  onPlayClick() {
    if (this.isPlaying) {
      this.howl.pause();
    } else {
      this.howl.play();
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

  /**
   * Handler per la progress bar.
   * Al cambiamento manuale del valore della progress-bar porta il brano
   * al punto desiderato
   */
  onProgressBarChange(eventEmitted: any) {
    if (
      eventEmitted.event.type !== 'mousemove' &&
      eventEmitted.event.type !== 'touchmove'
    ) {
      const song_duration = this.howl.duration();
      const tempo_scelto = eventEmitted.value;
      const result = song_duration * (tempo_scelto / 100);
      this.tempo = this.howl.seek(result) as number;
    }
  }

  /**
   * Handler per la progress bar.
   * Al cambiamento manuale del valore della progress-bar porta il brano
   * al punto desiderato
   */
  onProgressBarEnd(eventEmitted: any) {
    if (eventEmitted.originalEvent.type === 'mouseup') {
      const song_duration = this.howl.duration();
      const tempo_scelto = eventEmitted.value;
      const result = song_duration * (tempo_scelto / 100);
      this.tempo = this.howl.seek(result) as number;
    }
  }

  /**
   * Avvia lo slider al caricamento del brano selezionato
   */
  startPlay() {
    this.tempo = 0;
    this.attuale = '0:00';
    this.durata = '0:00';
    this.durata = this.braniService.durata;

    setInterval(() => {
      this.update();
      clearInterval();
    }, 1000);
  }

  private update() {
    if (this.isPlaying) {
      const seek = this.howl.seek() as number;
      this.tempo = (seek / this.howl.duration()) * 100;
      const minutes = Math.floor(seek / 60);
      const seconds = Math.floor(seek % 60);
      this.attuale = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  }

  onSwitchMode() {
    this.fullMode = !this.fullMode;
  }
}
