using SimpleSaleSystem.Data;
using SimpleSaleSystem.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace SimpleSaleSystem.WebFramework.Configuration
{
    public static class InitGlobalItems
    {
        public static void ConfigureGlobalItems(this WebApplication app)
        {
            using IServiceScope serviceScope = app.Services.CreateScope();
            var services = serviceScope.ServiceProvider;
            var dbContext = services.GetService<ApplicationDbContext>();
            if (dbContext != null)
            {
                GlobalItems.AllPages = [.. dbContext.Set<PageList>().AsNoTracking()];
            }
        }
    }
}
