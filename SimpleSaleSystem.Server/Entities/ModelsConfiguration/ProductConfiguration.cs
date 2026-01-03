using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Product", "dbo");
            builder.HasKey(p => p.ID);
            builder.Property(p => p.ID).ValueGeneratedOnAdd();
            builder.Property(p => p.BarCode).HasMaxLength(50);
            builder.Property(p => p.ProductCode).IsRequired();
            builder.Property(p => p.ProductModel).HasMaxLength(150);
            builder.Property(p => p.ProductName).HasMaxLength(150).IsRequired();
            builder.Property(p => p.IsDeleted);
        }
    }
}
