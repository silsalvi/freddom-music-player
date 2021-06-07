import { Injectable } from '@angular/core';
import {
  RicercaBrani,
  RicercaBraniResponse,
  TipiRicerca,
} from '../models/brano.model';
import { BehaviorSubject } from 'rxjs';
import { Howl, Howler } from 'howler';
import { NgxSpinnerService } from 'ngx-spinner';
import { loadingProps } from 'src/app/config/loading-congif';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdvancedSearch } from '../models/advanced-search.model';
import { tap } from 'rxjs/operators';

const BASE_API_URL = environment.apiFreedom;
@Injectable({
  providedIn: 'root',
})
export class BraniService {
  braniSubject = new BehaviorSubject<RicercaBraniResponse>(null);
  brani$ = this.braniSubject.asObservable();
  howl: Howl = null;
  mostraPlayer: boolean;
  branoSelezionato: RicercaBraniResponse;
  durata: string;
  risultatiRicerca: RicercaBraniResponse[] = [];
  listaBrani: RicercaBraniResponse[] = [];
  isRetrivedFromLocal: boolean = false;
  updateEnabledField = new BehaviorSubject<string>(TipiRicerca.BRANO);
  rowsInPage: number = 5;
  /**
   * Ritorna true se c'è già un brano in riproduzione
   */
  get isPlaying() {
    return this.howl.playing();
  }

  constructor(private spinner: NgxSpinnerService, private http: HttpClient) {
    const enabled = localStorage.getItem('enabledField');
    if (enabled) {
      this.updateEnabledField.next(enabled);
    }
  }

  /**
   * Riproduce un brano passato in input
   * @param brano il brano da riprodurre
   */
  riproduci(brano: RicercaBraniResponse, autoplay: boolean = true) {
    this.branoSelezionato = brano;
    if (this.branoSelezionato?.id !== this.braniSubject.value?.id) {
      this.spinner.show(undefined, loadingProps);
      this.creaNuovoFlusso(brano, autoplay);
    }
  }

  /**
   * Ritorna un nuovo oggetto di tipo Howl per riprodurre un nuovo brano
   * @param brano brano da cui creare il nuovo flusso
   */
  private creaNuovoFlusso(
    brano: RicercaBraniResponse,
    autoplay: boolean = false
  ) {
    this.risultatiRicerca.forEach((song) => {
      song.selected = false;
      if (brano.id === song.id) {
        song.selected = true;
      }
    });

    if (this.howl) {
      this.howl.pause();
      this.howl.stop();
    }

    this.getBrano(brano).subscribe((stream: any) => {
      this.howl = new Howl({
        src: URL.createObjectURL(stream),
        autoplay: autoplay,
        format: ['mp4', 'webm', 'm4a'],
        html5: true,
      });
      Howler.autoUnlock = false;
      if (autoplay) {
        this.howl.once('play', () => {
          this.durata = this.calcolaDurata();
          this.braniSubject.next(brano);
          this.mostraPlayer = true;
        });
      } else {
        this.howl.once('load', () => {
          this.durata = this.calcolaDurata();
          this.braniSubject.next(brano);
          this.mostraPlayer = true;
        });
      }
    });
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

  /**
   * Effettua una ricerca avanzata al servizio di Youtube
   * @param ricerca
   */
  getRicercheAvanzate(ricerca: AdvancedSearch) {
    return this.http.post<RicercaBraniResponse[]>(
      BASE_API_URL + '/find-brani/advanced',
      ricerca
    );
  }

  /**
   * Effettua una chiamata al servizio di Freedom per recuperare lo stream del file mp3,
   * ottenuto a partire dalla conversione effettuata lato backend
   */
  getBrano(brano: RicercaBraniResponse) {
    return this.http.get(BASE_API_URL + '/video/' + brano.id, {
      responseType: 'blob' as 'json',
      observe: 'body',
    });
  }

  /**
   * Effettua una chiamata al backend per ritornare i brani appartenenti ad una playlist.
   */
  getSongsByPlaylist(playlist: RicercaBraniResponse) {
    return this.http.get<RicercaBraniResponse[]>(
      BASE_API_URL + '/getPlaylist/' + playlist.id
    );
  }

  /**
   * Effettua una chiamata al backend per ritornare i brani appartenenti ad una playlist.
   */
  getSongsByAlbum(album: RicercaBraniResponse) {
    return this.http.get<RicercaBraniResponse[]>(
      BASE_API_URL + '/getAlbum/' + album.id
    );
  }

  /**
   * Effettua una chiamata al backend per ritornare i brani appartenenti ad una playlist.
   */
  getSongsByArtist(artist: RicercaBraniResponse) {
    return this.http.post<RicercaBraniResponse[]>(
      BASE_API_URL + '/getSongsByArtist',
      { name: artist.titolo }
    );
  }
}
