using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatorio."),
        // MinLength(3, ErrorMessage = "{0} deve ter no mínimo 4 caracteres.")
        // MaxLength(5, ErrorMessage = "{0} deve ter no máximo 50 caracteres.")]
        StringLength(50, MinimumLength = 4, ErrorMessage = "Intervalo permitido de 4 a 50 caracteres.")]
        public string Tema { get; set; }

        [Display(Name = "Qtd Pessoas"),
        Range(1, 120000, ErrorMessage = "{0} deve estar entre 1 e 120.000")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessageResourceName = "Não é uma imagem válida. (gif, jpg, jpeg, bmp, png)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatorio."),
        Phone(ErrorMessage = "O comapo {0} está com o número inválido.")]
        public string Telefone { get; set; }

        [Display(Name = "e-mail"),
        Required(ErrorMessage = "O campo {0} é obrigatorio."),
        EmailAddress(ErrorMessage = "É necessário ser um {0} valido.")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}