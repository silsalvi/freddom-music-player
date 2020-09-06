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
    this.spinner.show();
    this.mostraPlayer = true;
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
    });

    setTimeout(() => {
      this.spinner.hide();
    }, this.howl.play());

    this.braniSubject.next(brano);
  }
}
