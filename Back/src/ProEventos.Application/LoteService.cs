using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;

        public LoteService(ILotePersist lotePersist, IMapper mapper)
        {
            this._mapper = mapper;
            this._lotePersist = lotePersist;
        }

        private async Task AddLote(int eventoId, LoteDto model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;

                _lotePersist.Add<Lote>(lote);

                await _lotePersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                foreach (var model in models)
                {
                    if(model.Id == 0)
                    {
                        await AddLote(eventoId, model);
                    }
                    else
                    {
                        var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);

                        model.EventoId = eventoId;

                        _mapper.Map(model, lote);

                        _lotePersist.Update<Lote>(lote);

                        await _lotePersist.SaveChangesAsync();
                    }
                }

                var loteRetorno =  await _lotePersist.GetLotesByEventoIdAsync(eventoId);

                return _mapper.Map<LoteDto[]>(loteRetorno);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) throw new Exception("Lote para delete não encontrado.");

                _lotePersist.Delete<Lote>(lote);

                return await _lotePersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                var lotesDto = _mapper.Map<LoteDto[]>(lotes);
 
                return lotesDto;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

         public async Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) return null;

                var LoteDto = _mapper.Map<LoteDto>(lote);
 
                return LoteDto;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}