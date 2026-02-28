using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoftLineTest.Models
{
    public class Cliente
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Codigo { get; set; }

        [Required, StringLength(60)]
        public string Nome { get; set; }

        [StringLength(100)]
        public string Fantasia { get; set; }

        [CpfCnpj(ErrorMessage = "Documento inválido")]
        public string Documento { get; set; }

        public string Endereco { get; set; }
    }
}