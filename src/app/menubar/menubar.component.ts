import { Component, OnInit, HostListener } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
  //valore della ricerca
  ricerca: string;
  private timeout: number;
  constructor(
    private braniService: BraniService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  /**
   * Listener per la ricerca di un brano.
   * Alla digitazione dei caratteri effettua una ricerca per like (similarità)
   *
   * @todo implementare ricerca al backend
   */
  @HostListener('keyup', ['$event'])
  onSearch() {
    clearTimeout(this.timeout);
    this.spinner.show();
    this.timeout = setTimeout(() => {
      this.braniService.risultatiRicerca = this.braniService
        .getBraniMock()
        .filter((brano) => {
          const regex = new RegExp(this.ricerca.toLowerCase());
          return regex.test(brano.nome.toLowerCase());
        });
      this.spinner.hide();
    }, 1000);
  }
}
