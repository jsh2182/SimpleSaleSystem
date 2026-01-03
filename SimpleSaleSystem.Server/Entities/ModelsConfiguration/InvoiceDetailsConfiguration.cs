using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities.ModelsConfiguration
{
    public class InvoiceDetailsConfiguration : IEntityTypeConfiguration<InvoiceDetails>
    {
        public void Configure(EntityTypeBuilder<InvoiceDetails> builder)
        {
            builder.ToTable(nameof(InvoiceDetails), "dbo");
            builder.HasKey(i => i.ID);
            builder.Property(i => i.ID).ValueGeneratedOnAdd();
            builder.Property(i => i.Discount).HasPrecision(14, 2);
            builder.Property(i => i.DiscountPercent).HasPrecision(8, 6);
            builder.Property(i => i.ProductCount).HasPrecision(10, 4);
            builder.Property(i => i.PurchasePrice).HasPrecision(18, 2);
            builder.Property(i => i.ProductSerial).HasMaxLength(50);
            builder.Property(i => i.PureTotalPrice).HasPrecision(18, 2);
            builder.Property(i => i.Tax).HasPrecision(14, 2);
            builder.Property(i => i.TaxPercent).HasPrecision(4, 2);
            builder.Property(i => i.TotalPrice).HasPrecision(18, 2);
            builder.Property(i => i.UnitPrice).HasPrecision(14, 2);
            builder.HasOne(i => i.Product).WithMany(p => p.InvoiceDetails).HasForeignKey(i => i.ProductID).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(i => i.Invoice).WithMany(i => i.InvoiceDetails).HasForeignKey(i => i.InvoiceID).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
