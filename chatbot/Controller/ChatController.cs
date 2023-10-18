using chatbot.Data;
using chatbot.Models;
using Microsoft.AspNetCore.Mvc;

namespace Chatbot.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly BancoContext _context;

        public ChatController(BancoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            // Este endpoint não tem implementação específica, retorna valores de exemplo.
            return new string[] { "valor1", "valor2" };
        }

        [HttpGet("{id}")]
        public string Get(int id)
        {
            // Este endpoint não tem implementação específica, retorna um valor de exemplo.
            return "valor";
        }

        [HttpPost("conversa")]
        public IActionResult CreateConversa([FromBody] Conversa conversa)
        {
            if (ModelState.IsValid)
            {
                // Cria uma nova conversa
                var novaConversa = new Conversa
                {
                    Nome = conversa.Nome,
                    Situacao = true // Define o status inicial como 'true'
                };

                _context.Conversas.Add(novaConversa);
                _context.SaveChanges();
                return Ok(novaConversa);
            }
            return BadRequest(); // Lida com erros de validação
        }

        [HttpPost("mensagem")]
        public IActionResult SendMessage([FromBody] Mensagens mensagem)
        {
            if (ModelState.IsValid)
            {
                // Cria uma nova mensagem
                var novaMensagem = new Mensagens
                {
                    EDoUsuario = mensagem.EDoUsuario,
                    EResumo = mensagem.EResumo,
                    Mensagem = mensagem.Mensagem,
                    Situacao = true, // Define o status inicial como 'true'
                    IdMensagem = mensagem.IdMensagem // Associa a mensagem pai, se aplicável
                };

                _context.Mensagens.Add(novaMensagem);
                _context.SaveChanges(); // Salva no banco de dados

                return Ok(novaMensagem); // Retorna a mensagem criada ou seu ID
            }

            return BadRequest(); // Lida com erros de validação
        }

        [HttpPost("upload")]
        public IActionResult UploadFile([FromBody] Arquivos arquivos)
        {
            if (ModelState.IsValid)
            {
                // Cria um novo registro de arquivo
                var novoArquivo = new Arquivos
                {
                    ConteudoLink = arquivos.ConteudoLink,
                    ConteudoData = arquivos.ConteudoData, // O conteúdo real do arquivo como array de bytes
                    Situacao = true, // Define o status inicial como 'true'
                    IdMensagem = arquivos.IdMensagem // Associa o arquivo a uma mensagem
                };

                _context.Arquivos.Add(novoArquivo);
                _context.SaveChanges(); // Salva no banco de dados

                return Ok(novoArquivo);
            }

            return BadRequest(); // Lida com erros de validação
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
            // Este endpoint não tem implementação específica para atualização.
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            // Este endpoint não tem implementação específica para exclusão.
        }
    }
}
