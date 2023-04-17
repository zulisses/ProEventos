using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ProEventos.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Cria um host bilda e executa ele 
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
        // Define a classe "startup" como a startup a ser usada pelo web host e é responsavel por gerir os diferentes niveis da aplicação (Controllers, Data e models)
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
