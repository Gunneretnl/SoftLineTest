using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SoftLineTest.Models.DTOs
{
    public class VendaDTO
    {
        [Required]
        public int ClienteCodigo { get; set; }

        [Required]
        public List<ItemVendaDTO> Itens { get; set; }
    }

    public class ItemVendaDTO
    {
        [Required]
        public int ProdutoCodigo { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantidade { get; set; }
    }
}