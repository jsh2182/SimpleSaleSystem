using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
    {
        public void Configure(EntityTypeBuilder<SystemSetting> builder)
        {
            builder.ToTable("SystemSettings", "dbo");
            builder.HasKey(s => s.ID);
            builder.Property(s => s.SettingName).IsRequired().HasMaxLength(150);
            builder.Property(s => s.SettingValue).HasMaxLength(500);
            builder.HasIndex(s => s.SettingName).HasDatabaseName("IX_SystemSetting_Name");
            builder.HasData(new SystemSetting() { ID = 1, SettingName = "DefaultTaxPercent", SettingValue = "10" });
        }
    }
}
