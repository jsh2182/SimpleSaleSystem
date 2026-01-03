using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities.ModelsConfiguration
{
    public class Vw_InvoiceInfoConfiguration : IEntityTypeConfiguration<Vw_InvoiceInfo>
    {
        void IEntityTypeConfiguration<Vw_InvoiceInfo>.Configure(EntityTypeBuilder<Vw_InvoiceInfo> builder)
        {
            builder.ToView("Vw_InvoiceInfoes", "dbo");
            builder.HasKey(v => v.ID);
        }
    }
}
