using Humanizer.Localisation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftLineTest.Models
{
    public class Produto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int Codigo { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória")]
        [StringLength(60)]
        public string Descricao { get; set; }

        [StringLength(14)]
        public string CodigoBarras { get; set; }

        [Required(ErrorMessage = "O preço é obrigatório")]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage ="O valor de venda deve ser maior que 0")]
        public decimal ValorVenda { get; set; }

        [Column(TypeName = "decimal(18,3)")]
        [Range(0, double.MaxValue, ErrorMessage = "Peso bruto deve ser maior ou igual a 0")]
        public decimal PesoBruto { get; set; }

        [Column(TypeName = "decimal(18,3)")]
        [Range(0, double.MaxValue, ErrorMessage = "Peso líquido deve ser maior ou igual a 0")]
        public decimal PesoLiquido { get; set; }
    }
}