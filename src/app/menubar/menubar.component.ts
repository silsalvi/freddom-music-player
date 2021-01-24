import { Component, OnInit, HostListener } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { loadingProps } from '../config/loading-congif';
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
  constructor(
    private braniService: BraniService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  /**
   * Listener per la ricerca di un brano.
   * Alla digitazione dei caratteri effettua una ricerca per like (similarità)
   */
  @HostListener('keydown', ['$event'])
  onSearch(event: KeyboardEvent) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (
        this.ricerca.length > 0 &&
        event.key &&
        event.key.match(/[a-zA-Z0-9]+$/g)
      ) {
        this.spinner.show(undefined, loadingProps);
        const request: RicercaBrani = { name: this.ricerca };
        this.braniService.getRisultatiRicerca(request).subscribe((brani) => {
          this.spinner.hide();
          this.braniService.risultatiRicerca = brani;
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
