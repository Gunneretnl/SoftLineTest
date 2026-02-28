using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftLineTest.Data;
using SoftLineTest.Models;
using SoftLineTest.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoftLineTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VendasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendaResponseDTO>>> GetVendas()
        {
            var vendas = await _context.Vendas
                .Include(v => v.Itens)
                    .ThenInclude(i => i.Produto)
                .Include(v => v.Usuario)
                .Include(v => v.Cliente)
                .ToListAsync();

            var response = vendas.Select(v => new VendaResponseDTO
            {
                Codigo = v.Codigo,
                ClienteCodigo = v.ClienteCodigo,
                ClienteNome = v.Cliente != null ? v.Cliente.Nome : "Cliente não encontrado",
                UsuarioId = v.UsuarioId,
                UsuarioNome = v.Usuario?.Nome ?? "Desconhecido",
                Data = v.Data,
                Total = v.Total,
                Itens = v.Itens.Select(i => new ItemVendaResponseDTO
                {
                    ProdutoCodigo = i.ProdutoCodigo,
                    ProdutoDescricao = i.Produto?.Descricao ?? "Produto não encontrado",
                    Quantidade = i.Quantidade,
                    ValorUnitario = i.ValorUnitario,
                    Subtotal = i.Subtotal
                }).ToList()
            });

            return Ok(response);
        }

        [HttpGet("{codigo}")]
        public async Task<ActionResult<VendaResponseDTO>> GetVenda(int codigo)
        {
            var venda = await _context.Vendas
                .Include(v => v.Itens)
                    .ThenInclude(i => i.Produto)
                .Include(v => v.Usuario)
                .Include(v => v.Cliente)
                .FirstOrDefaultAsync(v => v.Codigo == codigo);

            if (venda == null) return NotFound();

            var response = new VendaResponseDTO
            {
                Codigo = venda.Codigo,
                ClienteCodigo = venda.ClienteCodigo,
                ClienteNome = venda.Cliente != null ? venda.Cliente.Nome : "Cliente não encontrado",
                UsuarioId = venda.UsuarioId,
                UsuarioNome = venda.Usuario?.Nome ?? "Desconhecido",
                Data = venda.Data,
                Total = venda.Total,
                Itens = venda.Itens.Select(i => new ItemVendaResponseDTO
                {
                    ProdutoCodigo = i.ProdutoCodigo,
                    ProdutoDescricao = i.Produto?.Descricao ?? "Produto não encontrado",
                    Quantidade = i.Quantidade,
                    ValorUnitario = i.ValorUnitario,
                    Subtotal = i.Subtotal
                }).ToList()
            };

            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<VendaResponseDTO>> PostVenda(VendaDTO vendaDTO)
        {
            var cliente = await _context.Clientes.FindAsync(vendaDTO.ClienteCodigo);
            if (cliente == null)
                return BadRequest($"Cliente com Codigo {vendaDTO.ClienteCodigo} não existe.");

            var usuarioIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Id");
            var usuarioNomeClaim = User.Claims.FirstOrDefault(c => c.Type == "Nome");

            var usuarioId = usuarioIdClaim != null ? int.Parse(usuarioIdClaim.Value) : 0;
            var usuarioNome = usuarioNomeClaim != null ? usuarioNomeClaim.Value : "Desconhecido";

            var venda = new Venda
            {
                ClienteCodigo = vendaDTO.ClienteCodigo,
                UsuarioId = usuarioId,
                Data = DateTime.Now,
                Itens = new List<ItensVenda>()
            };

            var produtoIds = vendaDTO.Itens.Select(i => i.ProdutoCodigo).ToList();
            var produtos = await _context.Produtos
                                .Where(p => produtoIds.Contains(p.Codigo))
                                .ToListAsync();

            decimal total = 0;

            if (vendaDTO == null)
                return BadRequest("Dados da venda inválidos.");

            if (vendaDTO.Itens == null || vendaDTO.Itens.Count == 0)
                return BadRequest("A venda deve ter ao menos 1 item.");

            foreach (var itemDto in vendaDTO.Itens)
            {
                var produto = produtos.FirstOrDefault(p => p.Codigo == itemDto.ProdutoCodigo);
                if (produto == null)
                    return BadRequest($"Produto com Codigo {itemDto.ProdutoCodigo} não existe.");

                var item = new ItensVenda
                {
                    ProdutoCodigo = produto.Codigo,
                    Quantidade = itemDto.Quantidade,
                    ValorUnitario = produto.ValorVenda,
                    Subtotal = itemDto.Quantidade * produto.ValorVenda,
                    Venda = venda,
                    Produto = produto
                };

                total += item.Subtotal;
                venda.Itens.Add(item);
            }

            venda.Total = total;

            _context.Vendas.Add(venda);
            await _context.SaveChangesAsync();

            var response = new VendaResponseDTO
            {
                Codigo = venda.Codigo,
                ClienteCodigo = venda.ClienteCodigo,
                ClienteNome = cliente.Nome,
                UsuarioId = venda.UsuarioId,
                UsuarioNome = usuarioNome,
                Data = venda.Data,
                Total = venda.Total,
                Itens = venda.Itens.Select(i => new ItemVendaResponseDTO
                {
                    ProdutoCodigo = i.ProdutoCodigo,
                    ProdutoDescricao = i.Produto?.Descricao ?? "Produto não encontrado",
                    Quantidade = i.Quantidade,
                    ValorUnitario = i.ValorUnitario,
                    Subtotal = i.Subtotal
                }).ToList()
            };

            return CreatedAtAction(nameof(GetVenda), new { codigo = venda.Codigo }, response);
        }
    }
}