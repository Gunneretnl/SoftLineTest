using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SoftLineTest.Models.DTOs
{
    public class VendaCreateDto
    {
        [Required]
        public int ClienteCodigo { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Deve ter ao menos 1 item na venda")]
        public int UsuarioId { get; set; }
        public List<ItemVendaCreateDto> Itens { get; set; } = new List<ItemVendaCreateDto>(); 
    }
}