export interface RicercaBrani {
  name: string;
}
export interface RicercaBraniResponse {
  titolo: string;
  id: string;
  artista: string;
  thumbnail: string;
  totalTrack: number;
  selected: boolean;
}

export enum TipiRicerca {
  BRANO = 'brano',
  VIDEO = 'video',
  PLAYLIST = 'playlist',
  ALBUM = 'album',
  ARTISTA = 'artista',
}
