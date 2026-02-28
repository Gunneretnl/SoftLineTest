using System.ComponentModel.DataAnnotations;

namespace SoftLineTest.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(120)]
        public string Nome { get; set; }

        [Required, MaxLength(60)]
        public string Login { get; set; }

        [Required, MaxLength(510)]
        public string Senha { get; set; }

        [MaxLength(40)]
        public string Perfil { get; set; } 
    }
}