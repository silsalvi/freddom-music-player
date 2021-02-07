import { Component, ViewChild } from '@angular/core';
import { RicercaBraniResponse } from '../models/brano.model';
import { BraniService } from '../services/brani.service';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.css'],
})
export class MusicListComponent {
  get isPlaying() {
    return this.braniService.isPlaying;
  }

  get mostraPlayer() {
    return this.braniService.mostraPlayer;
  }

  get enabledField() {
    return this.braniService.enabledField;
  }

  constructor(public braniService: BraniService) {}

  /**
   * Handler per l'evento di selezione di un brano.
   * Avvia la riproduzione di un brano selezionato dalla lista.
   */
  onSelection(brano: RicercaBraniResponse) {
    this.braniService.riproduci(brano);
  }

  /**
   * Handler per il click di una playlist.
   * Avvia la ricerca dei brani presenti in una playlist
   * @param playlist
   */
  onPlaylistClick(playlist: RicercaBraniResponse) {
    this.braniService.getSongsByPlaylist(playlist).subscribe((res) => {
      this.braniService.risultatiRicerca = res;
      this.braniService.listaBrani = [...res];
      this.braniService.enabledField = 'brano';
    });
  }

  /**
   * Handler per il click di un album.
   * Avvia la ricerca dei brani presenti in un album
   * @param album
   */
  onAlbumClick(album: RicercaBraniResponse) {
    this.braniService.getSongsByAlbum(album).subscribe((res) => {
      this.braniService.risultatiRicerca = res;
      this.braniService.listaBrani = [...res];
      this.braniService.enabledField = 'brano';
    });
  }

  /**
   * Handler per il click di un'artista'.
   * Avvia la ricerca dei brani per nome di un'artista
   * @param artista
   */
  onArtistaClick(artista: RicercaBraniResponse) {
    this.braniService.getSongsByArtist(artista).subscribe((res) => {
      this.braniService.risultatiRicerca = res;
      this.braniService.listaBrani = [...res];
      this.braniService.enabledField = 'brano';
    });
  }
}
