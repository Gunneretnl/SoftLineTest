using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftLineTest.Data;
using SoftLineTest.Models;

namespace SoftLineTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        [HttpGet("{codigo}")]
        public async Task<ActionResult<Cliente>> GetCliente(int codigo)
        {
            var cliente = await _context.Clientes.FindAsync(codigo);

            if (cliente == null)
                return NotFound();

            return cliente;
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCliente),
                                   new { codigo = cliente.Codigo },
                                   cliente);
        }

        [HttpPut("{codigo}")]
        public async Task<IActionResult> PutCliente(int codigo, Cliente cliente)
        {
            if (codigo != cliente.Codigo)
            {
                return BadRequest("Código do cliente não confere.");
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Clientes.Any(e => e.Codigo == codigo))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{codigo}")]
        public async Task<IActionResult> DeleteCliente(int codigo)
        {
            var cliente = await _context.Clientes.FindAsync(codigo);

            if (cliente == null)
                return NotFound();

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}