using System;
using System.Collections.Generic;

namespace SoftLineTest.Models.DTOs
{
    public class VendaResponseDTO
    {
        public int Codigo { get; set; }
        public int ClienteCodigo { get; set; }
        public string ClienteNome { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNome { get; set; } 
        public DateTime Data { get; set; }
        public decimal Total { get; set; }
        public List<ItemVendaResponseDTO> Itens { get; set; } = new();
    }
}