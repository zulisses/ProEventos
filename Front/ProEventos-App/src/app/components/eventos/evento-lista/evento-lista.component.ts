import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { environment } from '@environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef!: BsModalRef;
  public eventos: Evento[] = [];
  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = false;
  public eventoId = 0;
  public pagination = {} as Pagination;
  public termoBuscaChanged: Subject<string> = new Subject<string>();

  public filtrarEventos(evt: any): void
  {
    if(this.termoBuscaChanged.observers.length === 0){

      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this.spinner.show();
          this.eventoService
              .getEventos(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                filtrarPor
                ).subscribe(
                  (response: PaginatedResult<Evento[]>) => {
                    this.eventos = response.result;
                    this.pagination = response.pagination;
                  },
                  (error: any) => {
                    this.toastr.error("Erro ao Carregar os Eventos.", "Error!");
                  }
                ).add(() => this.spinner.hide());
        }
      );
    }
    this.termoBuscaChanged.next(evt.value);
  }

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }

  public ngOnInit(): void
  {
    this.pagination = { currentPage: 1, itemsPerPage: 3 } as Pagination;
    this.carregarEventos();
  }

  public mostraImagem(imagemURL: string): string {
    return (imagemURL !== "") ?
        `${environment.apiURL}resources/imagens/${imagemURL}` :
        "assets/img/semImagem.jpeg";
  }

  public carregarEventos(): void
  {
    this.spinner.show();
    const observer = {
      next: (response: PaginatedResult<Evento[]>) => {
        this.eventos = response.result;
        this.pagination = response.pagination;
      },
      error: (error: any) => {
        this.toastr.error("Erro ao Carregar os Eventos.", "Error!");
      }
    };
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(observer).add(() => this.spinner.hide());
  }


  public openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: any) => {
        this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado!');
        this.carregarEventos();
      },
      error: (error: any) => {
        console.error(error);
        this.toastr.error(`Error ao tentar deletar o evento ${this.eventoId}.`, "Erro!");
      },
      complete: () => {}
    }).add(() => this.spinner.hide());

  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: Number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }
}
