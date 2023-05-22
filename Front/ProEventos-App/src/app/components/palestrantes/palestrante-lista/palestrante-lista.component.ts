import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  public palestrantes: Palestrante[] = [];
  public palestranteId = 0;
  public pagination = {} as Pagination;

  constructor(private palestranteService: PalestranteService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }


  ngOnInit() {
    this.pagination = { currentPage: 1, itemsPerPage: 3 } as Pagination;
    this.carregarPalestrantes();
  }

  public carregarPalestrantes(): void
  {
    this.spinner.show();
    const observer = {
      next: (response: PaginatedResult<Palestrante[]>) => {
        this.palestrantes = response.result;
        this.pagination = response.pagination;
      },
      error: (error: any) => {
        this.toastr.error("Erro ao Carregar os Palestrantes.", "Error!");
      }
    };
    this.palestranteService.getPalestrantes(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(observer).add(() => this.spinner.hide());
  }

  public filtrarPalestrantes(evt: any): void
  {
    if(this.termoBuscaChanged.observers.length === 0){

      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.palestranteService
              .getPalestrantes(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                filtrarPor
                ).subscribe(
                  (response: PaginatedResult<Palestrante[]>) => {
                    this.palestrantes = response.result;
                    this.pagination = response.pagination;
                  },
                  (error: any) => {
                    this.toastr.error("Erro ao Carregar os Palestrantes.", "Error!");
                  }
                ).add(() => this.spinner.hide());
        }
      );
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public getImagemURL(imagemName: string): string {
    if(imagemName)
      return environment.apiURL +  `Resources/perfil/${imagemName}`;
    else
      return "./assets/img/perfil.jpg";
  }

}
