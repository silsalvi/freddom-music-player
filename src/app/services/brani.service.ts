import { Injectable } from '@angular/core';
import { brani } from '../mock-data';
import { Brano } from '../models/brano.model';

@Injectable({
  providedIn: 'root',
})
export class BraniService {
  risultatiRicerca: Brano[] = brani;
  constructor() {}

  /**
   * Restituisce l'array di brani mockati
   * @returns array di brani mockati
   */
  getBraniMock() {
    return brani;
  }
}
