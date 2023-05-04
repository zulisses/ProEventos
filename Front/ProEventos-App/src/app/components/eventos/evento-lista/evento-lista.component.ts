import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
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
  public eventoId = 0;

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
    this.carregarEventos();
  }

  public mostraImagem(imagemURL: string): string {
    return (imagemURL !== "") ?
        `${environment.apiURL}resources/imagens/${imagemURL}` :
        "assets/img/semImagem.jpeg";
  }

  public carregarEventos(): void
  {
    const observer = {
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = eventos;
      },
      error: (error: any) => {
        this.toastr.error("Erro ao Carregar os Eventos.", "Error!");
      }
    };
    this.eventoService.getEventos().subscribe(observer).add(() => this.spinner.hide());
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
}
