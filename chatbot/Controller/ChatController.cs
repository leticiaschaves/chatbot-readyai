using chatbot.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Chatbot.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        // GET: api/<ChatController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ChatController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ChatController>
        [HttpPost("conversa")]
        public IActionResult CreateConversa ([FromBody] Conversa conversa)
        {
            return Ok();
        }

        [HttpPost("mensagem")]
        public IActionResult SendMessage([FromBody] Mensagens mensagens)
        {
            return Ok();
        }

        [HttpPost("upload")]
        public IActionResult UploadFile([FromBody] Arquivos arquivos)
        {
            return Ok();
        }

        // PUT api/<ChatController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ChatController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
