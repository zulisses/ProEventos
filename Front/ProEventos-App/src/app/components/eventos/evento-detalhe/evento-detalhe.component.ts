import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { environment } from '@environments/environment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef!: BsModalRef;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = "post";
  loteAtual = {id: 0, nome: "", indice: 0};
  imagemURL = "assets/img/upload.png";
  file!: File[];

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: "theme-default",
      showWeekNumbers: false
    };
  }

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: "theme-default",
      showWeekNumbers: false
    };
  }

  get lotes(): FormArray {
    return this.form.get("lotes") as FormArray;
  }

  constructor(private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService: LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService)
  {
    this.localeService.use("pt-br");
  }

  public carregarEvento() : void{
    const eventoIdParm = this.activRouter.snapshot.paramMap.get("id");

    if(eventoIdParm !== null){
      this.spinner.show();

      this.estadoSalvar = "put";

      this.eventoService.getEventoById(+eventoIdParm).subscribe({
        next: (evento: Evento) => {
          this.evento = { ... evento};
          this.form.patchValue(this.evento);

          if(this.evento.imagemURL !== "") {
            this.imagemURL = environment.apiURL + "resources/imagens/" + this.evento.imagemURL;
          }

          this.evento.lotes.forEach(lote => this.lotes.push(this.criarFormLote(lote)));
          //this.carregarLotes();
        },
        error: (error: any) => {
          this.toastr.error("Erro ao tentar carregar Evento.", "Erro!");
          console.error(error);
        }
      }).add(() => this.spinner.hide());
    }
  }

  // public carregarLotes(): void {
  //   this.loteService.getLotesByEventoId(this.evento.id).subscribe(
  //     (lotesRetorno: Lote[]) => {
  //       lotesRetorno.forEach(lote => this.lotes.push(this.criarFormLote(lote)));
  //     },
  //     (error: any) => {
  //       this.toastr.error("Erro ao tentar carregar lotes.", "Erro!")
  //       console.error(error);
  //     }
  //   ).add(() => this.spinner.hide());
  // }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  private validation(): void {
    this.form = this.fb.group({
      tema: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ["", Validators.required],
      dataEvento: ["", Validators.required],
      qtdPessoas: ["", [Validators.required, Validators.max(120000)]],
      telefone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      imagemURL: [""],
      lotes: this.fb.array([])
    });
  }

  public adicionarLote(): void {
    this.lotes.push(this.criarFormLote({id: 0} as Lote));
  }

  private criarFormLote(lote: Lote): FormGroup {
    return this.fb.group({
            id: [lote.id],
            nome: [lote.nome , Validators.required],
            quantidade: [lote.quantidade , Validators.required],
            preco: [lote.preco , Validators.required],
            dataInicio: [lote.dataInicio],
            dataFim: [lote.dataFim]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(compoForm: FormControl | null | AbstractControl | undefined) : any {
    return {'is-invalid': compoForm?.errors && compoForm?.touched}
  }

  public salvarEvento(): void {
    this.spinner.show();

    if(this.form.valid) {
      if(this.estadoSalvar === "post"){
        this.evento = { ... this.form.value};
      }else{
        this.evento = {id: this.evento.id, ... this.form.value};
      }

      if(this.estadoSalvar === "put" || this.estadoSalvar === "post"){
        this.eventoService[this.estadoSalvar](this.evento).subscribe(
            {
              next: (eventoRetorno: Evento) => {
                this.toastr.success("Evento salvo com Sucesso.", "Sucesso!");
                this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
              },
              error: (error: any) => {
                console.error(error);
                this.toastr.error("Error ao salvar o evento.", "Erro!");
              }
            }
          ).add(() => this.spinner.hide());

      }
    }
  }

  public salvarLotes(): void {
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.evento.id, this.form.value.lotes)
      .subscribe(
        () => {
          this.toastr.success("Lotes salvos com sucesso.", "Sucesso!");
          //this.lotes.reset();
        },
        (error: any) => {
          this.toastr.error("Erro ao tentar salvar lotes.", "Error!");
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {

    this.loteAtual.id = this.lotes.get(indice+".id")!.value;
    this.loteAtual.nome = this.lotes.get(indice+'.nome')!.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: "modal-sm"});
  }


  public confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();


    this.loteService.deleteLote(this.loteAtual.id, this.evento.id).subscribe(
      () => {
        this.lotes.removeAt(this.loteAtual.indice);
        this.toastr.success("Lote deletado com sucesso.", "Sucesso!");
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}.`, "Erro!");
        console.error(error);
      }
      ).add(() => this.spinner.hide());
  }

  public declineDeleteLote(): void {
    this.modalRef.hide();
  }

  public retornaTituloLote(nome: string): string {
    return nome === null || nome === "" ? "Lote" : nome;
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);

    this.uploadImagem();
  }

  private uploadImagem(): void {
    this.spinner.show();

    this.eventoService.postUpload(this.evento.id, this.file[0]).subscribe(
      () => {
        this.carregarEvento();
        this.toastr.success("Imagem atualizada com sucesso.", "Sucesso!");
      },
      (error: any) => {
        this.toastr.error("Erro ao fazer upload de imagem.", "Erro!");
        console.error(error)
      }
    ).add(() => this.spinner.hide());
  }
}
