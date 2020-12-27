import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { brani } from '../mock-data';
import { Brano } from '../models/brano.model';
import { BehaviorSubject } from 'rxjs';
import { Howl } from 'howler';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root',
})
export class BraniService {
  risultatiRicerca: Brano[] = brani;
  braniSubject = new BehaviorSubject<Brano>(null);
  brani$ = this.braniSubject.asObservable();
  howl = new Howl({
    src: [''],
    format: ['mp3'],
  });
  mostraPlayer: boolean;
  branoSelezionato: Brano;
  durata: string;
  /**
   * Ritorna true se c'è già un brano in riproduzione
   */
  get isPlaying() {
    return this.howl.playing();
  }

  constructor(private spinner: NgxSpinnerService) {}

  /**
   * Restituisce l'array di brani mockati
   * @returns array di brani mockati
   */
  getBraniMock() {
    return brani;
  }

  /**
   * Riproduce un brano passato in input
   * @param brano il brano da riprodurre
   */
  riproduci(brano: Brano) {
    this.branoSelezionato = brano;
    this.creaNuovoFlusso(brano);
  }

  /**
   * Ritorna un nuovo oggetto di tipo Howl per riprodurre un nuovo brano
   * @param brano brano da cui creare il nuovo flusso
   */
  private creaNuovoFlusso(brano: Brano) {
    this.howl.pause();
    this.howl.stop();

    this.howl = new Howl({
      src: [brano.path],
      autoplay: true,
    });
    this.spinner.show();

    this.howl.once('play', () => {
      this.durata = this.calcolaDurata();
      this.spinner.hide();
      this.braniSubject.next(brano);
      this.mostraPlayer = true;
      this.applySelectedClass(brano.id);
    });
  }

  /**
   * Applica la classe selected al brano selezionato
   * @param id id del brano selezionato su cui applicare la classe
   */
  private applySelectedClass(id: number) {
    document.querySelectorAll('.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    const element = document.querySelector(`#brano-${id}`);
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
}
