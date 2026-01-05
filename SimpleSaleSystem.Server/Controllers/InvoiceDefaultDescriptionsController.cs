using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities.DtoModels;
using SimpleSaleSystem.Server.Entities;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceDefaultDescriptionsController(IRepository<InvoiceDefaultDescription> repo) : ControllerBase

    {
        private readonly IRepository<InvoiceDefaultDescription> _repo = repo;
        [HttpPost("[action]")]
        public async Task<ActionResult> Create(InvoiceDefaultDescriptionDto model, CancellationToken cancellationToken)
        {
            await _repo.AddAsync(new InvoiceDefaultDescription() { Description = model.Description, ID = 0 }, cancellationToken);
            return Ok();
        }

        [HttpDelete("[action]")]
        public async Task<ActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var desc = await _repo.GetByIDAsync(cancellationToken, id);
            if (desc == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            await _repo.DeleteAsync(desc, cancellationToken);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<InvoiceDefaultDescriptionDto[]>> GetAll(CancellationToken cancellationToken)
        {
            InvoiceDefaultDescriptionDto[] result = await _repo.TableNoTracking.Select(i => new InvoiceDefaultDescriptionDto()
            {
                Description = i.Description,
                ID = i.ID,
            }).OrderBy(d=>d.Description).ToArrayAsync(cancellationToken);
            return Ok(new { list = result, totalCount = result.Length });
        }
    }
}
