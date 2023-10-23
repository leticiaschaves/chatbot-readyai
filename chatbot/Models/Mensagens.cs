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

        // Adicione uma propriedade para a conversa à qual pertence
        public int ConversaId { get; set; }
        public Conversa Conversa { get; set; }
    }
}
