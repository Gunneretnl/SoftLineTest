using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftLineTest.Data;
using SoftLineTest.Models;

namespace SoftLineTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

  
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos.ToListAsync();
        }

    
        [HttpGet("{codigo}")]
        public async Task<ActionResult<Produto>> GetProduto(int codigo)
        {
            var produto = await _context.Produtos.FindAsync(codigo);
            if (produto == null)
                return NotFound();

            return produto;
        }


        [HttpPut("{codigo}")]
        public async Task<IActionResult> PutProduto(int codigo, Produto produto)
        {
            produto.Codigo = codigo;

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProdutoExists(codigo))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            try
            {
                _context.Produtos.Add(produto);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProduto), new { codigo = produto.Codigo }, produto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{codigo}")]
        public async Task<IActionResult> DeleteProduto(int codigo)
        {
            var produto = await _context.Produtos.FindAsync(codigo);
            if (produto == null)
                return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProdutoExists(int codigo)
        {
            return _context.Produtos.Any(e => e.Codigo == codigo);
        }
    }
}