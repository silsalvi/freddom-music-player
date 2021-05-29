import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RicercaBraniResponse, TipiRicerca } from '../models/brano.model';
import { BraniService } from '../services/brani.service';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css'],
})
export class MusicListComponent implements OnInit {
  get isPlaying() {
    return this.braniService.isPlaying;
  }

  first = 0;
  enabledField$: Observable<string>;
  tipiRicerca = TipiRicerca;
  paginaCorrente = 1;
  constructor(public braniService: BraniService) {}
  ngOnInit() {
    const firstFromLocal = +localStorage.getItem('first');
    const pageCurr = +localStorage.getItem('paginaCorrente');
    if (firstFromLocal && !isNaN(firstFromLocal)) {
      this.first = firstFromLocal;
    }

    if (pageCurr && !isNaN(pageCurr)) {
      this.paginaCorrente = pageCurr;
    }

    this.enabledField$ = this.braniService.updateEnabledField
      .asObservable()
      .pipe(
        tap(() => {
          this.first = 0;
        })
      );

    this.braniService.brani$.subscribe(() => {
      this.first = this.paginaCorrente * 5;
    });
  }

  /**
   * Handler per l'evento di selezione di un brano.
   * Avvia la riproduzione di un brano selezionato dalla lista.
   */
  onSelection(brano: RicercaBraniResponse) {
    this.braniService.riproduci(brano);
    this.braniService.risultatiRicerca.forEach((song) => {
      song.selected = false;
    });
    brano.selected = true;
    this.braniService.listaBrani = [...this.braniService.risultatiRicerca];
  }

  /**
   * Handler per il click di una playlist.
   * Avvia la ricerca dei brani presenti in una playlist
   * @param playlist
   */
  onPlaylistClick(playlist: RicercaBraniResponse) {
    this.braniService.getSongsByPlaylist(playlist).subscribe((res) => {
      this.updateSearch(res);
    });
  }

  /**
   * Handler per il click di un album.
   * Avvia la ricerca dei brani presenti in un album
   * @param album
   */
  onAlbumClick(album: RicercaBraniResponse) {
    this.braniService.getSongsByAlbum(album).subscribe((res) => {
      this.updateSearch(res);
    });
  }

  /**
   * Handler per il click di un'artista'.
   * Avvia la ricerca dei brani per nome di un'artista
   * @param artista
   */
  onArtistaClick(artista: RicercaBraniResponse) {
    this.braniService.getSongsByArtist(artista).subscribe((res) => {
      this.updateSearch(res);
    });
  }

  /**
   * Aggiorna le ricerche
   */
  updateSearch(res: RicercaBraniResponse[]) {
    this.braniService.risultatiRicerca = res;
    this.braniService.updateEnabledField.next(TipiRicerca.BRANO);
  }

  /**
   * Aggiorna l'attributo first ad ogni cambio di pagina
   */
  onPage(event: any) {
    this.braniService.rowsInPage = this.braniService.risultatiRicerca.slice(
      event.first,
      event.first + event.rows
    ).length;

    this.first = event.first;
    this.paginaCorrente = this.first / event.rows + 1;

    localStorage.setItem('first', String(this.first));
    localStorage.setItem('paginaCorrente', String(this.paginaCorrente));
  }
}
