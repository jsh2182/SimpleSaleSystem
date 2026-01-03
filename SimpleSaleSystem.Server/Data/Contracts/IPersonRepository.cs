using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;

namespace SimpleSaleSystem.Data.Repositories
{
    public interface IPersonRepository:IRepository<Person>
    {
        Task<long> AddAsync(Person model, CancellationToken cancellationToken, bool checkDup = true, bool saveNow = true);
        Task CheckDup(Person person, CancellationToken cancellationToken);
        Task DeleteAsync(long id, CancellationToken cancellationToken);
        Task<PersonDto[]> GetSimilarNamePeople(string name, CancellationToken cancellationToken);
        Task<IEnumerable<PersonDto>> SearchPerson(PersonSearchDto model, CancellationToken cancellationToken);
        Task UpdateAsync(Person model, CancellationToken cancellationToken);
    }
}