import { Injectable } from '@angular/core';
import {
  Brano,
  RicercaBrani,
  RicercaBraniResponse,
} from '../models/brano.model';
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
  howl = new Howl({
    src: [''],
    format: ['mp3'],
  });
  mostraPlayer: boolean;
  branoSelezionato: RicercaBraniResponse;
  durata: string;
  risultatiRicerca: RicercaBraniResponse[];
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
    this.getBrano(brano).subscribe((blob) => {
      this.creaNuovoFlusso(brano, blob);
      this.spinner.hide();
    });
  }

  /**
   * Ritorna un nuovo oggetto di tipo Howl per riprodurre un nuovo brano
   * @param brano brano da cui creare il nuovo flusso
   */
  private creaNuovoFlusso(brano: RicercaBraniResponse, stream: Blob) {
    this.howl.pause();
    this.howl.stop();
    const reader = new FileReader();
    reader.readAsDataURL(stream);
    reader.onloadend = () => {
      const b64data = reader.result;
      this.howl = new Howl({
        src: [b64data.toString()],
        autoplay: true,
      });
      this.howl.once('play', () => {
        this.durata = this.calcolaDurata();
        this.braniSubject.next(brano);
        this.mostraPlayer = true;
        this.applySelectedClass(brano.id);
      });
    };
  }

  /**
   * Applica la classe selected al brano selezionato
   * @param id id del brano selezionato su cui applicare la classe
   */
  private applySelectedClass(id: string) {
    document.querySelectorAll('.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    const element = document.querySelector(`#brano${id}`);
    element.classList.add('selected');
  }

  /**
   * Calcola la durata effettiva di un brano,
   * ritornando sotto forma di stringa separata da carattere ":"
   * i minuti e i secondi
   */
  calcolaDurata() {
    const durataTotale = Math.floor(this.howl.duration());
    const minuti = Math.floor(durataTotale / 60);
    const secondi = Math.floor(durataTotale % 60);
    return `${minuti}:${secondi}`;
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

  /**
   * Effettua una chiamata al servizio di Freedom per recuperare lo stream del file mp3,
   * ottenuto a partire dalla conversione effettuata lato backend
   */
  getBrano(brano: RicercaBraniResponse) {
    return this.http.get(BASE_API_URL + '/video/' + brano.id, {
      responseType: 'blob',
    });
  }
}
