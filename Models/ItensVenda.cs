using SoftLineTest.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("ItensVenda")]
public class ItensVenda
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int VendaId { get; set; }

    [ForeignKey("VendaId")]
    public virtual Venda Venda { get; set; }

    [Required]
    public int ProdutoCodigo { get; set; }

    [ForeignKey("ProdutoCodigo")]
    public virtual Produto Produto { get; set; }

    [Required]
    public int Quantidade { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ValorUnitario { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Subtotal { get; set; }
}