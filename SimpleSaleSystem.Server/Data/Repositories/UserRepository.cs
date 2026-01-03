using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common.Exceptions;
using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Entities;

namespace SimpleSaleSystem.Data.Repositories
{
    public class UserRepository(ApplicationDbContext dbContext) : Repository<SystemUser>(dbContext), IUserRepository
    {

        public async Task AddAsync(SystemUser user, CancellationToken cancellationToken)
        {

            var exists = await TableNoTracking.AnyAsync(p => p.UserName == user.UserName, cancellationToken).ConfigureAwait(false);
            if (exists)
                throw new BadRequestException("نام کاربری تکراری است");

            if (user.Password.HasValue())
            {
                string passwordHash = SecurityHelper.GetSha256Hash(user.Password);
                user.Password = passwordHash;
            }
            await base.AddAsync(user, cancellationToken);
        }

        public async Task UpdateAsync(SystemUser user, CancellationToken cancellationToken)
        {
            if (user.ID < 1)
            {
                throw new Exception("شناسه کاربر صحیح نیست");
            }
            var exists = await TableNoTracking.AnyAsync(p => (p.UserName == user.UserName || (!string.IsNullOrWhiteSpace(user.UserMobile) && p.UserMobile == user.UserMobile)) && p.ID != user.ID, cancellationToken).ConfigureAwait(false);
            if (exists)
            {
                throw new Exception("نام کاربری یا شماره همراه تکراری است");
            }

            await base.UpdateAsync(user, cancellationToken);
        }

        public async Task DeleteAsync(int userID, CancellationToken cancellationToken)
        {
            if (userID < 1)
            {
                throw new Exception("شناسه کاربر صحیح نیست");
            }
            await CheckDeleteIsValid(userID, cancellationToken);
            await Table.Where(u => u.ID == userID).ExecuteDeleteAsync(cancellationToken);
        }

        public Task<bool> UserIsValid(int userID, CancellationToken cancellationToken)
        {
            return TableNoTracking.AnyAsync(u => u.ID == userID && u.IsActive, cancellationToken);
        }

        public Task<SystemUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<SystemUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<SystemUser?> FindByUserAndPass(string username, string password, CancellationToken cancellationToken)
        {
            string passwordHash = SecurityHelper.GetSha256Hash(password);
            username = username.FixPersianChars().ToLower();
            var user = await TableNoTracking.FirstOrDefaultAsync(u => (u.UserName == username || u.UserMobile == username) && u.Password == passwordHash, cancellationToken);
            return user;
        }

        public async Task UpdateLastLoginDateAsync(SystemUser user, CancellationToken cancellationToken)
        {
            await Entities.Where(u => u.ID == user.ID).ExecuteUpdateAsync(setters => setters.SetProperty(u => u.LastLoginDate, DateTime.UtcNow), cancellationToken);
        }

        private async Task CheckDeleteIsValid(int userID, CancellationToken cancellationToken)
        {

            bool delIsForbidden = await DbContext.Set<Person>().AsNoTracking().AnyAsync(p => p.CreatingUserID == userID, cancellationToken).ConfigureAwait(false);
            if (delIsForbidden)
            {
                throw new Exception("این کاربر یک یا چند شخص جدید ثبت کرده و حذف آن مجاز نیست.");
            }
            delIsForbidden = await DbContext.Set<Invoice>().AsNoTracking().AnyAsync(p => p.CreateByID == userID, cancellationToken).ConfigureAwait(false);
            if (delIsForbidden)
            {
                throw new Exception("این کاربر یک یا چند فاکتور جدید ثبت کرده و حذف آن مجاز نیست.");
            }
        }
    }
}