import { Component, OnInit } from '@angular/core';
import { BraniService } from '../services/brani.service';
import { RicercaBrani } from '../models/brano.model';
import { AdvancedSearch } from '../models/advanced-search.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioButton } from 'primeng';

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
  advancedSearch: AdvancedSearch = {
    album: null,
    artist: null,
    playlist: null,
    song: null,
    video: null,
  };
  form: FormGroup;
  enabledField: string = 'song';
  constructor(
    private braniService: BraniService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      album: [null],
      video: [null],
      song: [null],
      playlist: [null],
      artist: [null],
    });

    this.onChangeRicerca();
  }

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

  /**
   * Listener per la ricerca avanzata.
   * Chiama il backend per ottenere dei risultati in base ad una ricerca avanzata
   */
  onAdvancedSearch() {
    const isValid = Object.values(this.form.controls).some(
      (control) => control.value
    );
    if (isValid) {
      this.advancedSearch = this.form.value;

      this.braniService
        .getRicercheAvanzate(this.advancedSearch)
        .subscribe((brani) => {
          this.showDialog = false;
          this.braniService.risultatiRicerca = brani;
          this.braniService.listaBrani = [...brani];
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  /**
   * Apre la modale di ricerca avanzata
   */
  openModal() {
    this.showDialog = true;
  }

  /**
   * Handler per il cambio di radio button.
   * Abilita il solo campo attualmente selezionato, disabilitando tutti gli altri
   */
  onChangeRicerca() {
    this.form.disable();
    this.form.reset();
    this.form.controls[this.enabledField].enable();
  }
}
