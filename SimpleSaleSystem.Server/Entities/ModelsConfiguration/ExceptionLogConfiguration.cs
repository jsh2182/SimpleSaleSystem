using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class ExceptionLogConfiguration : IEntityTypeConfiguration<ExceptionLog>
    {
        public void Configure(EntityTypeBuilder<ExceptionLog> builder)
        {
            builder.ToTable("ExceptionLog", "dbo");
            builder.HasKey(e => e.ID);
            builder.Property(e => e.ID).ValueGeneratedOnAdd();
            builder.Property(e => e.MachineName).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Level).IsRequired().HasMaxLength(50);
            builder.Property(e => e.Message).IsRequired();
            builder.Property(e=>e.HttpAction).HasMaxLength(250);
            builder.Property(e=>e.CallSite).HasMaxLength(500);
            builder.Property(e=>e.RequestedURL).HasMaxLength(500);


//                جدول پیوست ها حذف شده
//جدول کالا واحد شمارش داشته باشه
        }
    }
}
