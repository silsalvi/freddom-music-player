import { MenuItem } from 'primeng/api';
import { Brano } from './models/brano.model';
export const menuItems: MenuItem[] = [];
export const brani: Brano[] = [
  {
    nome: 'Je so pazz',
    path: 'assets/app-data/pino-daniele_je-so-pazzo.mp3',
  },
  {
    nome: 'Fear of the dark',
    path: 'assets/app-data/iron-maiden_fear-of-the-dark.mp3',
  },
  {
    nome: 'Bohemian Rhapsody',
    path: 'assets/app-data/queen_bohemian-rhapsody.mp3',
  },
];
