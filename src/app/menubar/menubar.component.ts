import { Component, OnInit } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { RicercaBrani } from '../models/brano.model';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
  //valore della ricerca
  ricerca: string = '';
  private timeout: number = 0;
  showDialog: boolean = false;
  constructor(private braniService: BraniService) {}

  ngOnInit(): void {}

  /**
   * Listener per la ricerca di un brano.
   * Alla digitazione dei caratteri effettua una ricerca per like (similarità)
   */
  onSearch() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.ricerca.length > 0) {
        const request: RicercaBrani = { name: this.ricerca };
        this.braniService.getRisultatiRicerca(request).subscribe((brani) => {
          this.braniService.risultatiRicerca = brani;
          this.braniService.listaBrani = [...brani];
        });
      } else {
        this.braniService.risultatiRicerca = [];
      }
    }, 800);
  }

  openModal() {
    this.showDialog = true;
  }
}
