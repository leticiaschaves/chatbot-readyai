using chatbot.Models;
using Microsoft.EntityFrameworkCore;
using System;



namespace chatbot.Data
{

    public class BancoContext : DbContext
    {
        public BancoContext(DbContextOptions<BancoContext> options) : base(options) { }

        public DbSet<Arquivos> Arquivos { get; set; }
        public DbSet<Conversa> Conversas { get; set; }
        public DbSet<Mensagens> Mensagens { get; set; }
    }
}
