using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Server.Entities.ModelsConfiguration
{
    public class InvoiceDefaultDescriptionConfiguration : IEntityTypeConfiguration<InvoiceDefaultDescription>
    {
        public void Configure(EntityTypeBuilder<InvoiceDefaultDescription> builder)
        {
            builder.ToTable("InvoiceDefaultDescriptions", "dbo");
            builder.HasKey(i => i.ID);
            builder.Property(i => i.ID).ValueGeneratedOnAdd();
            builder.HasData(new InvoiceDefaultDescription() { ID = 1, Description = "نرم افزارحضور و غیاب تحت وب -لایسنس یکساله" },
                new InvoiceDefaultDescription() { ID = 2, Description = "تنظیم روتر جهت استفاده از آی پی استاتیک" },
                new InvoiceDefaultDescription() { ID = 3, Description = "تنظیم مودم جهت استفاده از آی پی استاتیک" },
                new InvoiceDefaultDescription() { ID = 4, Description = "نرم افزار انتقال اطلاعات از برنامه دیتابیس پالیز به چارگون" },
                new InvoiceDefaultDescription() { ID = 5, Description = "نصب و راه اندازی آنلاین سنتر بصورت اینترنتی" },
                new InvoiceDefaultDescription() { ID = 6, Description = "نصب و راه اندازی اینترنتی نرم افزار حضور غیاب" },
                new InvoiceDefaultDescription() { ID = 7, Description = "لایسنس یکساله نرم افزار حضور و غیاب" }
            );

        }
    }
}
