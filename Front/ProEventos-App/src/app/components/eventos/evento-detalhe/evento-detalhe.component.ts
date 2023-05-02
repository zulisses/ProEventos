import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  evento!: Evento;
  form!: FormGroup;
  estadoSalvar = "post";

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder, private localeService: BsLocaleService, private router: ActivatedRoute, private eventoService: EventoService, private spinner: NgxSpinnerService, private toastr: ToastrService)
  {
    this.localeService.use("pt-br");
  }

  public carregarEvento() : void{
    const eventoIdParm = this.router.snapshot.paramMap.get("id");

    if(eventoIdParm !== null){
      this.spinner.show();

      this.estadoSalvar = "put";

      this.eventoService.getEventoById(+eventoIdParm).subscribe({
        next: (evento: Evento) => {
          this.evento = { ... evento};
          this.form.patchValue(this.evento);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error("Erro ao tentar carregar Evento.", "Erro!");
          console.error(error);
        },
        complete: () => {this.spinner.hide()}
      });
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
    this.validation();
  }

  private validation(): void {
    this.form = this.fb.group({
      tema: ["", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]],
      local: ["", Validators.required],
      dataEvento: ["", Validators.required],
      qtdPessoas: ["", [
        Validators.required,
        Validators.max(120000)
      ]],
      telefone: ["", Validators.required],
      email: ["", [
        Validators.required,
        Validators.email
      ]],
      imagemURL: ["", Validators.required]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(compoForm: FormControl) : any {
    return {'is-invalid': compoForm.errors && compoForm.touched}
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

  public salvarAlteracao(): void {
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
              next: () => {this.toastr.success("Evento salvo com Sucesso.", "Sucesso!")},
              error: (error: any) => {
                console.error(error);
                this.spinner.hide();
                this.toastr.error("Error ao salvar o evento.", "Erro!");
              },
              complete: () => {this.spinner.hide()}
            }
          );

      }
    }
  }
}
