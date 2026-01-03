using SimpleSaleSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace SimpleSaleSystem.Data.Repositories
{
    public class PagePermissionRepository(ApplicationDbContext dbContext) : Repository<PagePermission>(dbContext), IPagePermissionRepository
    {
    }

}
