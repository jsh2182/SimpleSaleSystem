using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;
using System.Security.Principal;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController(IPersonRepository personRepo,IRepository<Invoice> invoiceRepo, IMapper mapper) : ControllerBase
    {
        private readonly IPersonRepository _personRepo = personRepo;
        private readonly IMapper _mapper = mapper;
        private readonly IRepository<Invoice> _invoiceRepo = invoiceRepo;

        [HttpPost("[action]")]
        public async Task<ActionResult> Create(PersonDto model, CancellationToken cancellationToken)
        {
            Person person = _mapper.Map<Person>(model);
            IIdentity? identity = HttpContext.User.Identity;
            person.CreatingUserID = identity?.GetUserId<int>()??0;
            person.CreationDate = DateTime.UtcNow;
            await _personRepo.CheckDup(person, cancellationToken);
            if (model.PersonCode < 1)
            {
                var maxCode = await _personRepo.TableNoTracking.Select(p => p.PersonCode).DefaultIfEmpty().MaxAsync(cancellationToken);
                person.PersonCode = maxCode + 1;
            }
            await _personRepo.AddAsync(person, cancellationToken, false, true);
            return Ok(new { person.ID, person.PersonCode });
        }

        [HttpDelete("[action]")]
        public async Task<ActionResult> Delete(long id, CancellationToken cancellationToken)
        {

            bool deleteIsNotValid = await _invoiceRepo.TableNoTracking.AnyAsync(i => i.CustomerID == id, cancellationToken);
            if(deleteIsNotValid)
            {
                return BadRequest("برای این مشتری فاکتور ثبت شده است");
            }
            await _personRepo.DeleteAsync(id,  cancellationToken);
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> Update(PersonDto model, CancellationToken cancellationToken)
        {
            if (model.ID < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            Person? person = await _personRepo.Table.FirstOrDefaultAsync(p => p.ID == model.ID , cancellationToken).ConfigureAwait(false);
            if (person == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }

            _mapper.Map(model, person);
            await _personRepo.UpdateAsync(person, cancellationToken);
            return Ok(person.ID);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> Get(long id, CancellationToken cancellationToken)
        {
            Person? person = await _personRepo.TableNoTracking.FirstOrDefaultAsync(p => p.ID == id  && !p.IsDeleted, cancellationToken).ConfigureAwait(false);
            if (person == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            PersonDto result = _mapper.Map<PersonDto>(person);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<IEnumerable<PersonDto>>> GetAll(PersonSearchDto model, CancellationToken cancellationToken)
        {
            IEnumerable<PersonDto> result = await _personRepo.SearchPerson(model, cancellationToken);
            return Ok(new {list = result, totalCount = result.Count()});
        }
        [HttpGet("[action]")]
        public async Task<ActionResult<PersonDto[]>> GetSimilarNamePeople(string name, CancellationToken cancellationToken)
        {
            PersonDto[] result = await _personRepo.GetSimilarNamePeople(name, cancellationToken).ConfigureAwait(false);
            return Ok(new { list = result, totalCount = result.Count() });
        }

    }
}
