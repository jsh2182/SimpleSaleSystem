using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class SystemUserConfiguration : IEntityTypeConfiguration<SystemUser>
    {
        public void Configure(EntityTypeBuilder<SystemUser> builder)
        {
            builder.ToTable("SystemUser", "dbo");
            builder.HasKey(s => s.ID);
            builder.Property(s => s.ID).ValueGeneratedOnAdd();
            builder.Property(s => s.LoginInfo).HasMaxLength(1000);
            builder.Property(s => s.Password).HasMaxLength(100).IsRequired();
            builder.Property(s => s.UserFullName).HasMaxLength(50).IsRequired();
            builder.Property(s => s.UserMobile).HasMaxLength(11);
            builder.Property(s => s.UserName).HasMaxLength(50);
            builder.Property(s => s.IsActive);
            //21$YsTeM@DmIn82
            builder.HasData(new SystemUser() { ID = 1, UserName = "super", Password = "EU/iHN2gTDHERoJVW/i5ZqLustJGD1egyntDOUYgSSg=", UserFullName = "super" });
        }
    }
}
