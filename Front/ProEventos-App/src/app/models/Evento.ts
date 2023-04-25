import { Lote } from "./Lote";
import { Palestrante } from "./Palestrante";
import { RedeSocial } from "./RedeSocial";

export interface Evento {
   id: Number;
   local: string;
   dataEvento?: Date;
   tema: string;
   qtdPessoas: Number;
   imagemURL: string;
   telefone: string;
   email: string;
   lotes: Lote[];
   redesSociais: RedeSocial[];
   palestranteEventos: Palestrante[];
}
