using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace SimpleSaleSystem.Data
{
    public class ApplicationDbContext(DbContextOptions options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var assembly = typeof(IEntity).Assembly;
            modelBuilder.RegisterAllEntities<IEntity>(assembly);
            modelBuilder.RegisterEntityTypeConfiguration(assembly);
            modelBuilder.AddRestrictDeleteBehaviorConvention(
                                                             "SimpleSaleSystem.Entities.InvoiceDetails"
                                                             );
        }

        public override int SaveChanges()
        {
            CleanString();
            return base.SaveChanges();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            CleanString();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            CleanString();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            CleanString();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void CleanString()
        {
            var changedEntities = ChangeTracker.Entries()
                .Where(x => x.State == EntityState.Added || x.State == EntityState.Modified);
            foreach (var item in changedEntities)
            {
                if (item.Entity == null)
                    continue;

                var properties = item.Entity.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
                    .Where(p => p.CanRead && p.CanWrite && p.PropertyType == typeof(string));

                foreach (var property in properties)
                {
                    var propName = property.Name;
                    string? val = property.GetValue(item.Entity, null) as string;
                    if (!val.HasValue())
                    {
                        continue;
                    }
                    var newVal = val?.Fa2En().FixPersianChars();
                    if (newVal == val)
                        continue;
                    property.SetValue(item.Entity, newVal, null);
                }
            }
        }
    }
}

