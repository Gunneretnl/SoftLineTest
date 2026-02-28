namespace SoftLineTest.Models.DTOs
{
    public class ItemVendaResponseDTO
    {
        public int ProdutoCodigo { get; set; }
        public int Quantidade { get; set; }
        public string ProdutoDescricao { get; set; }
        public decimal ValorUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}