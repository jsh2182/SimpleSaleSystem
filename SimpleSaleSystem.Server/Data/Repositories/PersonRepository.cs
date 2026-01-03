using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common.Utilities;

namespace SimpleSaleSystem.Data.Repositories
{
    public class PersonRepository(ApplicationDbContext dbContext) : Repository<Person>(dbContext), IPersonRepository
    {
        public async Task<long> AddAsync(Person model, CancellationToken cancellationToken, bool checkDup = true, bool saveNow = true)
        {

            if (checkDup)
                await CheckDup(model, cancellationToken);
            await base.AddAsync(model, cancellationToken, saveNow);
            return model.ID;
        }
        public async Task UpdateAsync(Person model, CancellationToken cancellationToken)
        {

            if (model.ID < 1)
            {
                throw new Exception("شناسه شخص معتبر نیست");
            }
            await CheckDup(model, cancellationToken);
            await base.UpdateAsync(model, cancellationToken);
        }
        public async Task DeleteAsync(long id, CancellationToken cancellationToken)
        {
            if (id < 1)
            {
                throw new Exception("شناسه شخص معتبر نیست.");
            }
            #region Check For Related Entities
            bool isRelated = await TableNoTracking.AnyAsync(p => p.ParentPersonID == id, cancellationToken);
            if (isRelated)
            {
                throw new Exception("این شخص، به اشخاص دیگر متصل است و حذف آن مجاز نیست");
            }
            #endregion
            Person? person = await Table.FirstOrDefaultAsync(p => p.ID == id, cancellationToken) ?? throw new Exception("اطلاعات درخواستی در سیستم وجود ندارد.");
            await DeleteAsync(person, cancellationToken);
        }
        public async Task CheckDup(Person person, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrWhiteSpace(person.Mobile))
            {
                person.Mobile = person.Mobile.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.Phone))
            {
                person.Phone = person.Phone.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.Phone))
            {
                person.Phone = person.Phone.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.NationalCode))
            {
                person.NationalCode = person.NationalCode.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.PostalCode))
            {
                person.PostalCode = person.PostalCode.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.CommercialCode))
            {
                person.CommercialCode = person.CommercialCode.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.RegisterationNumber))
            {
                person.RegisterationNumber = person.RegisterationNumber.Fa2En().CleanString();
            }
            if (!string.IsNullOrWhiteSpace(person.ProductSerials))
            {
                person.ProductSerials = person.ProductSerials.Fa2En().CleanString();
            }
            var existing = await TableNoTracking.Where(p =>
                                    p.ID != person.ID && (
                                    (!string.IsNullOrEmpty(person.Mobile) && p.Mobile != null && p.Mobile.Equals(person.Mobile)) ||
                                    (!string.IsNullOrEmpty(person.Phone) && p.Phone != null && p.Phone.Equals(person.Phone)) ||
                                    (!string.IsNullOrEmpty(person.NationalCode) && p.NationalCode != null && p.NationalCode.Equals(person.NationalCode)) ||
                                    (!string.IsNullOrEmpty(person.PostalCode) && p.PostalCode != null && p.PostalCode.Equals(person.PostalCode)) ||
                                    (!string.IsNullOrEmpty(person.CommercialCode) && p.CommercialCode != null && p.CommercialCode.Equals(person.CommercialCode)) ||
                                    (!string.IsNullOrEmpty(person.ProductSerials) && p.ProductSerials != null && p.ProductSerials.Equals(person.ProductSerials)) ||
                                    (!string.IsNullOrEmpty(person.RegisterationNumber) && p.RegisterationNumber != null && p.RegisterationNumber.Equals(person.RegisterationNumber)) ||
                                    (person.PersonCode > 0 && person.PersonCode == person.PersonCode)
                                    ))
                  .Select(p => new
                  {
                      p.Mobile,
                      p.NationalCode,
                      p.Phone,
                      p.PostalCode,
                      p.CommercialCode,
                      p.RegisterationNumber,
                      p.PersonCode,
                      p.ProductSerials
                  }).FirstOrDefaultAsync(cancellationToken);
            ;
            if (existing == null)
            {
                return;
            }
            bool dupResult = existing.Mobile != null && existing.Mobile.Equals(person.Mobile);
            if (dupResult)
            {
                throw new Exception("شماره همراه تکراری است.");
            }
            dupResult = existing.Phone != null && existing.Phone.Equals(person.Phone);
            if (dupResult)
            {
                throw new Exception("شماره تلفن تکراری است.");
            }
            dupResult = existing.NationalCode != null && existing.NationalCode.Equals(person.NationalCode);
            if (dupResult)
            {
                throw new Exception("کد ملی تکراری است.");
            }
            dupResult = existing.PostalCode != null && existing.PostalCode.Equals(person.PostalCode);
            if (dupResult)
            {
                throw new Exception("کد پستی تکراری است.");
            }
            dupResult = existing.CommercialCode != null && existing.CommercialCode.Equals(person.CommercialCode);
            if (dupResult)
            {
                throw new Exception("کد اقتصادی تکراری است.");
            }
            dupResult = existing.RegisterationNumber != null && existing.RegisterationNumber.Equals(person.RegisterationNumber);
            if (dupResult)
            {
                throw new Exception("شماره ثبت تکراری است.");
            }
            dupResult = existing.PersonCode != null && existing.PersonCode.Equals(person.PersonCode);
            if (dupResult)
            {
                throw new Exception("کد شخص تکراری است.");
            }
            dupResult = existing.ProductSerials != null && existing.ProductSerials.Equals(person.ProductSerials);
            if (dupResult)
            {
                throw new Exception($"شخص دیگری در سیستم با این سریال ها ثبت شده است. کد:{person.PostalCode}، نام: {person.PersonName}");
            }

        }
        public async Task<IEnumerable<PersonDto>> SearchPerson(PersonSearchDto model, CancellationToken cancellationToken)
        {
            IQueryable<Person> qry = TableNoTracking.Where(p => !p.IsDeleted);
            if (model.Mobile.HasValue())
            {
                model.Mobile = model.Mobile.FixPersianChars().CleanString();
                qry = qry.Where(q => EF.Functions.Like(q.Mobile, "%" + model.Mobile + "%"));
            }
            if (model.Phone.HasValue())
            {
                model.Phone = model.Phone.FixPersianChars().CleanString();
                qry = qry.Where(q => EF.Functions.Like(q.Mobile, "%" + model.Phone + "%"));
            }
            if (model.PersonName.HasValue())
            {
                model.PersonName = model.PersonName.FixPersianChars();
                string[] names = model.PersonName.Split(' ');
                foreach (string name in names)
                {
                    qry = qry.Where(q => EF.Functions.Like(q.PersonName, "%" + name + "%"));
                }
            }
            List<Person> people = await qry.ToListAsync(cancellationToken).ConfigureAwait(false);
            IEnumerable<PersonDto> result = people.Select(p => new PersonDto()
            {
                AccountingType = p.AccountingType,
                IsBlackListed = p.IsBlackListed,
                Mobile = p.Mobile,
                NationalCode = p.NationalCode,
                PassportCode = p.PassportCode,
                PersonAddress = p.PersonAddress,
                PersonCode = p.PersonCode,
                ID = p.ID,
                PersonName = p.PersonName,
                Phone = p.Phone,
                SubscriptionCode = p.SubscriptionCode,
                CallerName = p.CallerName,
                ProductSerials = p.ProductSerials
            });
            return result;
        }
        public async Task<PersonDto[]> GetSimilarNamePeople(string name, CancellationToken cancellationToken)
        {
            IQueryable<Person> qry = TableNoTracking.Where(p => !p.IsDeleted);
            if (string.IsNullOrWhiteSpace(name))
            {
                return [];
            }

            name = name.FixPersianChars().Fa2En();
            string[] names = name.Split(' ');
            foreach (string n in names)
            {
                qry = qry.Where(q => EF.Functions.Like(q.PersonName, "%" + n + "%"));
            }

            PersonDto[] result = await qry.Select(p => new PersonDto()
            {
                ID = p.ID,
                PersonName = p.PersonName,
                ProductSerials = p.ProductSerials
            }).ToArrayAsync(cancellationToken).ConfigureAwait(false);
            return result;
        }
    }
}
