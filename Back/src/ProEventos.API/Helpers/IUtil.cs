using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ProEventos.API.Helpers
{
    public interface IUtil
    {
        Task<String> SaveImage(IFormFile imageFile, string destino);
        void DeleteImage(string imageName, string destino);
    }
}