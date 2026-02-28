using System.ComponentModel.DataAnnotations;

namespace SoftLineTest.Models.DTOs
{
    public class ItemVendaCreateDto    {
        [Required]
        public int ProdutoCodigo { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que 0")]
        public int Quantidade { get; set; } = 1; 
    }
}