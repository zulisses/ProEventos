import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable(
  //{providedIn: 'root'}
)
export class LoteService {
  baseURL = "https://localhost:5001/api/lotes";

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number) : Observable<Lote[]>
  {
    return this.http
    .get<Lote[]>(`${this.baseURL}/${eventoId}`)
    .pipe(take(1));
  }

  public saveLote(eventoId: number, lotes: Lote[]) : Observable<Lote[]>
  {
    return this.http
    .put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
    .pipe(take(1));
  }

  public deleteLote(loteId: number, eventoId: number) : Observable<any>
  {
    return this.http
    .delete<string>(`${this.baseURL}/${eventoId}/${loteId}`)
    .pipe(take(1));
  }
}
