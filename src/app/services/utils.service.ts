import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  /**
   * Converte una stringa del tipo MM:SS in numero.
   * @param duration
   */
  convertDurationToSeconds(duration: string): number {
    const [minutes, seconds] = duration.split(':');
    return Number(minutes) * 60 + (Number(seconds) - 1);
  }
}
