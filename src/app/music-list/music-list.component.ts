import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(public braniService: BraniService) {}
  ngOnInit() {
    const firstFromLocal = +localStorage.getItem('first');
    if (firstFromLocal && !isNaN(firstFromLocal)) {
      this.first = firstFromLocal;
    }

    this.enabledField$ = this.braniService.updateEnabledField.asObservable();
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
    this.braniService.listaBrani = [...res];
    this.braniService.updateEnabledField.next(TipiRicerca.BRANO);
  }

  /**
   * Aggiorna l'attributo first ad ogni cambio di pagina
   */
  onPage(event: any) {
    this.first = event.first;
    localStorage.setItem('first', String(this.first));
  }
}
