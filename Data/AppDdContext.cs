using Microsoft.EntityFrameworkCore;
using SoftLineTest.Models;

namespace SoftLineTest.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Venda> Vendas { get; set; }
        public DbSet<ItensVenda> ItensVendas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Produto>().HasKey(p => p.Codigo);
            modelBuilder.Entity<Produto>()
                .Property(p => p.Descricao).HasMaxLength(60).IsRequired();
            modelBuilder.Entity<Produto>()
                .Property(p => p.CodigoBarras).HasMaxLength(14).IsRequired();
            modelBuilder.Entity<Produto>()
                .Property(p => p.ValorVenda).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Produto>()
                .Property(p => p.PesoBruto).HasColumnType("decimal(18,3)");
            modelBuilder.Entity<Produto>()
                .Property(p => p.PesoLiquido).HasColumnType("decimal(18,3)");

            modelBuilder.Entity<Cliente>().HasKey(c => c.Codigo);

            modelBuilder.Entity<Usuario>().HasKey(u => u.Id);
            modelBuilder.Entity<Usuario>().Property(u => u.Nome).HasMaxLength(120).IsRequired();
            modelBuilder.Entity<Usuario>().Property(u => u.Login).HasMaxLength(60).IsRequired();
            modelBuilder.Entity<Usuario>().Property(u => u.Senha).HasMaxLength(510).IsRequired();
            modelBuilder.Entity<Usuario>().Property(u => u.Perfil).HasMaxLength(40).IsRequired(false);

            modelBuilder.Entity<Venda>()
                .HasOne(v => v.Usuario)
                .WithMany()
                .HasForeignKey(v => v.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Venda>()
                .HasOne(v => v.Cliente)
                .WithMany()
                .HasForeignKey(v => v.ClienteCodigo)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ItensVenda>()
                .HasOne(i => i.Venda)
                .WithMany(v => v.Itens)
                .HasForeignKey(i => i.VendaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItensVenda>()
                .HasOne(i => i.Produto)
                .WithMany()
                .HasForeignKey(i => i.ProdutoCodigo)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}