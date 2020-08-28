import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { Subscription } from 'rxjs';
import { Brano } from '../models/brano.model';
import { brani } from '../mock-data';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  branoSelezionato: Brano;
  fullMode: boolean;
  tempo: number;
  tempoToDate: Date;
  durata: string;
  constructor(private braniService: BraniService) {}

  get isPlaying(): boolean {
    return this.braniService.isPlaying;
  }

  ngOnInit(): void {
    this.subscription = this.braniService.brani$.subscribe((brano) => {
      this.branoSelezionato = brano;
    });
    this.initSlider();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Handler per la riproduzione del brano
   * Stoppa o manda in play il brano selezionato
   */
  onPlayClick(event: Event) {
    event.stopPropagation();
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
  onForwardClick(event: Event) {
    event.stopPropagation();
    const brani = this.braniService.risultatiRicerca;
    let branoSelezionato = this.braniService.branoSelezionato;
    const index = brani.findIndex((brano) => brano === branoSelezionato);
    if (index < brani.length - 1) {
      this.braniService.branoSelezionato = brani[index + 1];
    } else {
      this.braniService.branoSelezionato = brani[0];
    }
    this.braniService.riproduci(this.braniService.branoSelezionato);
    this.initSlider();
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
  onBackwordClick(event: Event) {
    event.stopPropagation();
    const brani = this.braniService.risultatiRicerca;
    let branoSelezionato = this.braniService.branoSelezionato;
    const index = brani.findIndex((brano) => brano === branoSelezionato);
    if (index > 0) {
      this.braniService.branoSelezionato = brani[index - 1];
    } else {
      this.braniService.branoSelezionato = brani[brani.length - 1];
    }
    this.braniService.riproduci(this.braniService.branoSelezionato);
    this.initSlider();
  }

  /**
   * Handler per la progress bar.
   * Al cambiamento manuale del valore della progress-bar porta il brano
   * al punto desiderato
   */
  onProgressChange(event: any) {
    const song_duration = this.braniService.howl.duration();
    const tempo_scelto = event.value;

    this.tempo = this.braniService.howl.seek(
      song_duration * (tempo_scelto / 100)
    ) as number;
  }

  /**
   * Avvia lo slider al caricamento del componente
   */
  initSlider() {
    const sound = this.braniService.howl;

    setInterval(() => {
      update();
    }, 1000);

    const update = () => {
      if (sound.playing()) {
        this.tempo = ((sound.seek() as number) / sound.duration()) * 100;
        this.tempoToDate = new Date(this.tempo * 3600);
        const seconds = Math.floor(sound.duration());
        this.durata = Math.floor(seconds / 60) + ':' + Math.floor(seconds % 60);
      }
    };
  }
}
