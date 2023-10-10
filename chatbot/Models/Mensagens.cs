namespace chatbot.Models
{
    public class Mensagens
    {
        public int Id { get; set; }
        public bool EDoUsuario { get; set; }
        public bool EResumo { get; set; }
        public string Mensagem { get; set; }
        public bool Situacao { get; set; }
        public int IdArquivo { get; set; }
        public int IdMensagem { get; set; }
    }
}
