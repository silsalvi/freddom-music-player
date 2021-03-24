import { Howl } from 'howler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { RicercaBraniResponse } from '../models/brano.model';
import { trigger, style, transition, animate } from '@angular/animations';
import { UtilsService } from '../services/utils.service';
import { BehaviorSubject, timer } from 'rxjs';
import { repeat, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
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
  timeChanged: number;
  private playerSubject = new BehaviorSubject<boolean>(false);
  player$ = timer(0, 1000).pipe(
    switchMap((_) => this.playerSubject.asObservable()),
    takeWhile((_) => this.isPlaying),
    repeat()
  );
  constructor(public braniService: BraniService, private utils: UtilsService) {}

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
      if (this.braniService.isFirstPlay) {
        const attuale = localStorage.getItem('minutoCorrente');
        if (attuale && attuale !== '0:00') {
          const actual = this.utils.convertDurationToSeconds(attuale);
          this.howl.seek(actual);
          this.attuale = attuale;
          this.tempo = (actual / this.howl.duration()) * 100;
          this.braniService.isFirstPlay = false;
        }
      }
    });

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('minutoCorrente', this.attuale);
      localStorage.setItem(
        'brano',
        JSON.stringify(this.braniService.branoSelezionato)
      );
      localStorage.setItem(
        'risultati',
        JSON.stringify(this.braniService.listaBrani)
      );
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
    const brani = this.braniService.listaBrani;
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
    const brani = this.braniService.listaBrani;
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
    eventEmitted.event.preventDefault();
    eventEmitted.event.stopPropagation();
    const type = eventEmitted.event.type;
    if (type !== 'touchmove' && type !== 'mousemove') {
      this.timeChanged = this.calculateTime(eventEmitted);
      this.howl.seek(this.timeChanged);
    }
  }

  /**
   * Handler per il rilascio dello slider.
   * Porta il brano al valore richiesto
   * @param eventEmitted
   */
  onProgressBarEnd(eventEmitted: any) {
    eventEmitted.originalEvent.preventDefault();
    eventEmitted.originalEvent.stopPropagation();
    this.timeChanged = this.calculateTime(eventEmitted);
    this.howl.seek(this.timeChanged);
  }

  /**
   * Calcola il tempo verso cui spostarsi.
   */
  private calculateTime(eventEmitted: any) {
    const song_duration = this.howl.duration();
    const tempo_scelto = eventEmitted.value;
    return song_duration * (tempo_scelto / 100);
  }

  /**
   * Avvia lo slider al caricamento del brano selezionato
   */
  startPlay() {
    this.tempo = 0;
    this.attuale = '0:00';
    this.durata = '0:00';
    this.durata = this.braniService.durata;

    this.player$.subscribe((isPlaying) => {
      if (isPlaying) {
        this.update();
      }
    });
    this.playerSubject.next(true);
  }

  /**
   * Aggiorna il tempo man mano che viene richiamata
   */
  private update() {
    const seek = this.howl.seek() as number;
    this.tempo = (seek / this.howl.duration()) * 100;
    const minutes = Math.floor(seek / 60);
    const seconds = Math.floor(seek % 60);
    this.attuale = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  /**
   * Attiva o disattiva la full mode o la mini mode.
   */
  onSwitchMode() {
    this.fullMode = !this.fullMode;
  }
}
