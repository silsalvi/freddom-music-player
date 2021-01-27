import { Injectable } from '@angular/core';
import { RicercaBrani, RicercaBraniResponse } from '../models/brano.model';
import { BehaviorSubject } from 'rxjs';
import { Howl } from 'howler';
import { NgxSpinnerService } from 'ngx-spinner';
import { loadingProps } from 'src/app/config/loading-congif';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const BASE_API_URL = environment.apiFreedom;
@Injectable({
  providedIn: 'root',
})
export class BraniService {
  braniSubject = new BehaviorSubject<RicercaBraniResponse>(null);
  brani$ = this.braniSubject.asObservable();
  howl = null;
  mostraPlayer: boolean;
  branoSelezionato: RicercaBraniResponse;
  durata: string;
  risultatiRicerca: RicercaBraniResponse[];
  listaBrani: RicercaBraniResponse[];
  /**
   * Ritorna true se c'è già un brano in riproduzione
   */
  get isPlaying() {
    return this.howl.playing();
  }

  constructor(private spinner: NgxSpinnerService, private http: HttpClient) {}

  /**
   * Riproduce un brano passato in input
   * @param brano il brano da riprodurre
   */
  riproduci(brano: RicercaBraniResponse) {
    this.branoSelezionato = brano;
    this.spinner.show(undefined, loadingProps);
    this.creaNuovoFlusso(brano);
  }

  /**
   * Ritorna un nuovo oggetto di tipo Howl per riprodurre un nuovo brano
   * @param brano brano da cui creare il nuovo flusso
   */
  private creaNuovoFlusso(brano: RicercaBraniResponse) {
    if (this.howl) {
      this.howl.pause();
      this.howl.stop();
    }
    this.howl = new Howl({
      src: BASE_API_URL + '/video/' + brano.id,
      autoplay: true,
      format: ['mp4', 'webm'],
    });
    this.howl.once('play', () => {
      this.spinner.hide();
      this.durata = this.calcolaDurata();
      this.braniSubject.next(brano);
      this.mostraPlayer = true;
      this.applySelectedClass(brano.id);
    });
  }

  /**
   * Applica la classe selected al brano selezionato
   * @param id id del brano selezionato su cui applicare la classe
   */
  private applySelectedClass(id: string) {
    const elements = document.querySelectorAll('.selected');
    const element = document.querySelector(`#brano${id}`);
    if (elements && element) {
      elements.forEach((element) => {
        element.classList.remove('selected');
      });
      element.classList.add('selected');
    }
  }

  /**
   * Calcola la durata effettiva di un brano,
   * ritornando sotto forma di stringa separata da carattere ":"
   * i minuti e i secondi
   */
  calcolaDurata() {
    const durataTotale = Math.floor(this.howl.duration());
    const minutes = Math.floor(durataTotale / 60);
    const seconds = Math.floor(durataTotale % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  /**
   * Effettua una chiamata al servizio di Freedom per recuperare una lista di video
   * direttamente dalle API di Youtube
   */
  getRisultatiRicerca(ricerca: RicercaBrani) {
    return this.http.post<RicercaBraniResponse[]>(
      BASE_API_URL + '/find-brani',
      ricerca
    );
  }
}
