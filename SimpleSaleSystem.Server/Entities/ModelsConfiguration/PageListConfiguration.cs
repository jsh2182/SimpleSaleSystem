using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class PageListConfiguration : IEntityTypeConfiguration<PageList>
    {
        public void Configure(EntityTypeBuilder<PageList> builder)
        {
            builder.ToTable("PageList", "dbo");
            builder.HasKey(p => p.ID);
            builder.Property(p => p.ID).ValueGeneratedOnAdd();
            builder.Property(p => p.PageName).HasMaxLength(50).IsRequired();
            builder.Property(p => p.PersianName).HasMaxLength(50).IsRequired();
            builder.Property(p => p.IsReport);
            builder.HasIndex(p => p.ParentPageID).HasDatabaseName("IX_PageList_ParentPageID");
            builder.HasOne(p => p.ParentPage).WithMany(p => p.ChildPages).HasForeignKey(p => p.ParentPageID);
        }
    }
}
