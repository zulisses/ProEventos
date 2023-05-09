using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class EventoPersist : GeralPersist, IEventoPersist
    {
        private readonly ProEventosContext _context;
        public EventoPersist (ProEventosContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            if(includePalestrante)
                query.Include(e => e.PalestranteEventos)
                    .ThenInclude(pe => pe.Palestrante);

            query = query.OrderBy(e => e.Id).AsNoTracking()
                        .Where(e => e.Tema.ToLower().Contains(tema.ToLower()) && e.UserId == userId);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);


            if(includePalestrante)
                query.Include(e => e.PalestranteEventos)
                    .ThenInclude(pe => pe.Palestrante);
                    

            query = query.Where(e => e.UserId == userId).OrderBy(e => e.Id).AsNoTracking();

            return await query.ToArrayAsync();
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