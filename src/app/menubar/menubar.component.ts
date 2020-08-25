import { Component, OnInit, HostListener } from '@angular/core';
import { BraniService } from '../services/brani.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit {
  //valore della ricerca
  ricerca: string;

  constructor(private braniService: BraniService) {}

  ngOnInit(): void {}

  /**
   * Listener per la ricerca di un brano.
   * Alla digitazione dei caratteri effettua una per like (similarità)
   *
   * @todo implementare ricerca al backend
   * @param event keyboard event
   */
  @HostListener('keyup', ['$event'])
  onSearch() {
    this.braniService.risultatiRicerca = this.braniService
      .getBraniMock()
      .filter((brano) => {
        const regex = new RegExp(this.ricerca);
        return regex.test(brano.nome);
      });
  }
}
