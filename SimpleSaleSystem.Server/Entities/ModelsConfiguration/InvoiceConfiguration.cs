using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities.ModelsConfiguration
{
    public class InvoiceConfiguration:IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.ToTable(nameof(Invoice),"dbo");
            builder.HasKey(i => i.ID);
            builder.Property(i => i.ID).ValueGeneratedOnAdd();
            builder.Property(i => i.Description).HasMaxLength(1000);
            builder.Property(i=>i.ProductSerials).HasMaxLength(1000);
            builder.Property(i=>i.CallerName).HasMaxLength(150);
            builder.Property(i=>i.MoreDescription).HasMaxLength(1000);
            builder.Property(i => i.InvoiceNetPrice).HasPrecision(20, 2);
            builder.Property(i => i.InvoiceTotalPrice).HasPrecision(20, 2);
            builder.Property(i => i.PaidAmount).HasPrecision(20, 2);
            builder.Property(i => i.TaxAmount).HasPrecision(14, 2);
            builder.Property(i => i.TaxPercent).HasPrecision(5, 2);
            builder.Property(i => i.DiscountAmount).HasPrecision(14, 2);
            builder.Property(i => i.DiscountPercent).HasPrecision(5, 2);
            builder.HasOne(i => i.ParentInvoice).WithMany(i => i.ChildInvoices).HasForeignKey(i => i.ParentInvoiceID);
            builder.HasOne(i => i.CreatingUser).WithMany(u => u.Invoices).HasForeignKey(i => i.CreateByID).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(i => i.UpdatingUser).WithMany(u => u.Invoices_UpdateBy).HasForeignKey(i => i.UpdateByID).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(i => i.Person).WithMany(p => p.Invoices).HasForeignKey(i => i.CustomerID);
        }
    }
}
