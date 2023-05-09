using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class PalestrantePersist : GeralPersist, IPalestrantePersist
    {
        private readonly ProEventosContext _context;
        public PalestrantePersist(ProEventosContext context) : base(context)
        {
            this._context = context;
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.RedesSociais);

            if(includeEventos)
                query.Include(p => p.PalestranteEventos)
                    .ThenInclude(pe => pe.Evento);
                    

            query = query.OrderBy(p => p.Id).AsNoTracking()
                        .Where(p => p.User.NomeCompleto.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.RedesSociais);

            if(includeEventos)
                query.Include(p => p.PalestranteEventos)
                    .ThenInclude(pe => pe.Evento);
                    

            query = query.OrderBy(p => p.Id).AsNoTracking();

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(e => e.RedesSociais);

            if(includeEventos)
                query.Include(p => p.PalestranteEventos)
                    .ThenInclude(pe => pe.Evento);
                    

            query = query.OrderBy(p => p.Id).AsNoTracking()
                        .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }
    }
}