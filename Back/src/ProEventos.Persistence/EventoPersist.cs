using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{
    public class EventoPersist : GeralPersist, IEventoPersist
    {
        private readonly ProEventosContext _context;
        public EventoPersist (ProEventosContext context) : base(context)
        {
            _context = context;
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if(includePalestrante)
                query.Include(e => e.PalestranteEventos)
                    .ThenInclude(pe => pe.Palestrante);

            query = query.OrderBy(e => e.Id).AsNoTracking()
                        .Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                                     e.Local.ToLower().Contains(pageParams.Term.ToLower())) 
                                     && e.UserId == userId);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if(includePalestrante)
                query.Include(e => e.PalestranteEventos)
                    .ThenInclude(pe => pe.Palestrante);
                    

            query = query.OrderBy(e => e.Id).AsNoTracking()
                        .Where(e => e.Id == eventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }
    }
}