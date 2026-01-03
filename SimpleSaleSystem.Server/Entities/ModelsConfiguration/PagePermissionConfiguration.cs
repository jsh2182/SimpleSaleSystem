using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class PagePermissionConfiguration : IEntityTypeConfiguration<PagePermission>
    {
        public void Configure(EntityTypeBuilder<PagePermission> builder)
        {
            builder.ToTable("PagePermission", "dbo");
            builder.HasKey(p => p.ID);
            builder.Property(p => p.ID).ValueGeneratedOnAdd();
            builder.Property(p => p.CanDelete);
            builder.Property(p => p.CanInsert);
            builder.Property(p => p.CanInsert);
            builder.Property(p => p.CanUpdate);
            builder.HasIndex(p => p.PageID).HasDatabaseName("IX_PagePermission_PageID");
            builder.HasIndex(p => p.UserID).HasDatabaseName("IX_PagePermission_UserID");
            builder.HasOne(p => p.PageList).WithMany(p => p.PagePermissions).HasForeignKey(p => p.PageID);
            builder.HasOne(p => p.User).WithMany(u => u.Permissions).HasForeignKey(p => p.UserID);
        }
    }
}
