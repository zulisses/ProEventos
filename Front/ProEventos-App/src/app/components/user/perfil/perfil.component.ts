import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/validatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  constructor(private fb: FormBuilder, public accountService: AccountService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  get f(): any {return  this.form.controls; }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario(): void {
    this.userUpdate = { ...this.form.value };
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => this.toastr.success("Usuário atualizado.", "Sucesso!"),
      (error) => {
        this.toastr.error(error.error);
        console.error(error);
      }
    ).add(() => this.spinner.hide());
  }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        console.log(userRetorno);
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success("Usuário Carregado.", "Sucesso!");
      },
      (error) => {
        console.error(error);
        this.toastr.error("Usuário não carregado.", "Erro!");
        this.router.navigate(["/dashboard"]);
      }
    ).add(() => this.spinner.hide());
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch("password", "confirmarPassword")
    }

    this.form = this.fb.group({
      userName: [""],
      titulo: ["NaoInformado", Validators.required],
      primeiroNome: ["", Validators.required],
      ultimoNome: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", Validators.required],
      funcao: ["NaoInformado", Validators.required],
      descricao: ["", Validators.required],
      password: ["", [Validators.minLength(4), Validators.nullValidator]],
      confirmarPassword: ["", Validators.nullValidator]
    }, formOptions);
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }
}
