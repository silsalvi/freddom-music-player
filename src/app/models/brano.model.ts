import { Autore } from './autore.model';
export class Brano {
  id: number;
  nome: string;
  path: string;
  collaborazioni?: Autore[];
  autore: Autore;
  dataUscita?: Date;
  constructor(
    id: number,
    nome: string,
    path: string,
    autore: Autore,
    collaborazioni?: Autore[],
    dataUscita?: Date
  ) {
    this.id = id;
    this.nome = nome;
    this.path = path;
    if (collaborazioni) {
      this.collaborazioni = collaborazioni;
    } else {
      this.collaborazioni = [];
    }
    this.autore = autore;
    this.dataUscita = dataUscita;
  }

  /**
   * Ritorna una rappresentazione delle collaborazioni del brano sottoforma di stringa
   * nella seguente forma:
   * @example 'nomeArtista feat collab1,collab2 etc.'
   */
  collaborazioniToString() {
    return `${this.autore.nomeArte} feat. ${this.collaborazioni
      .map((feat) => feat.nomeArte)
      .join()}`;
  }
}

export interface RicercaBrani {
  name: string;
}
export interface RicercaBraniResponse {
  titolo: string;
  id: string;
  artista: string;
  thumbnail: string;
}
