namespace chatbot.Models
{
    public class Conversa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public bool Situacao { get; set; }

        // Adicione uma coleção de mensagens
        public ICollection<Mensagens> Mensagens { get; set; } = new List<Mensagens>();

        // Adicione uma coleção de arquivos
        public ICollection<Arquivos> Arquivos { get; set; } = new List<Arquivos>();
    }
}

        /* uma conversa pode ter vários arquivos */