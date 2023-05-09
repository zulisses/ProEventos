using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProEventos.Domain.Identity;

namespace ProEventos.Domain
{

    // classe modelo do projeto

    // [Table("EventosDetalhes")]
    public class Evento
    {
        // [Key]
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }

        // [NotMapped]                            não será mappeado no banco de dados, pois só faz parte da logica do programa
        // public int ContagemDias { get; set; }

        [Required,
        MaxLength(50)]
        public string Tema { get; set; }    
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public IEnumerable<Lote> Lotes { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestranteEventos { get; set; }
    }
}