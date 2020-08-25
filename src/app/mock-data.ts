import { MenuItem } from 'primeng/api';
import { Brano } from './models/brano.model';
export const menuItems: MenuItem[] = [];
export const brani: Brano[] = [
  new Brano('Je so pazz', 'assets/app-data/pino-daniele_je-so-pazzo.mp3', {
    nomeArte: 'Pino Daniele',
  }),
  new Brano(
    'Fear of the dark',
    'assets/app-data/iron-maiden_fear-of-the-dark.mp3',
    {
      nomeArte: 'Iron Maiden',
    }
  ),
  new Brano(
    'Bohemian Rhapsody',
    'assets/app-data/queen_bohemian-rhapsody.mp3',
    {
      nomeArte: 'Queen',
    }
  ),
  new Brano(
    'Medellin',
    'assets/app-data/gue-pequeno,lazza_medellin.mp3',
    {
      nomeArte: 'Gue Pequeno',
    },
    [{ nomeArte: 'Lazza' }]
  ),
  new Brano('Ricochet', 'assets/app-data/starset_ricochet.mp3', {
    nomeArte: 'Starset',
  }),
  new Brano(
    "Sono Un Bravo Ragazzo Un Po' Fuori Di Testa",
    'assets/app-data/random_sono-un-bravo-ragazzo-un-po-fuori-di-testa.mp3',
    {
      nomeArte: 'Random',
    }
  ),
];
