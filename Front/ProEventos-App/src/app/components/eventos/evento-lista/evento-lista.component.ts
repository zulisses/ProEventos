import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
  public eventosFiltrados: Evento[] = [];
  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = false;
  private filtroListado = "";

  public get filtroLista(): string
  {
    return this.filtroListado;
  }

  public set filtroLista(value: string)
  {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[]
  {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) { }

  public ngOnInit(): void
  {
    this.spinner.show();
    this.getEventos();
  }

  public getEventos(): void
  {
    const observer = {
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error("Erro ao Carregar os Eventos.", "Error!");
      },
      complete: () => this.spinner.hide()
    };
    this.eventoService.getEventos().subscribe(observer);
  }


  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado!');
  }

  public decline(): void {
    this.modalRef.hide();
  }

  public detalheEvento(id: Number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}