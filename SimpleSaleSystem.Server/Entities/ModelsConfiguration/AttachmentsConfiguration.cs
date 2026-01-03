using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class AttachmentsConfiguration: IEntityTypeConfiguration<Attachments>
    {
        public void Configure(EntityTypeBuilder<Attachments> builder)
        {
            builder.ToTable("Attachments", "dbo");
            builder.HasKey(a => a.ID);
            builder.Property(a => a.ID).ValueGeneratedOnAdd();
            builder.Property(a => a.ParentType).IsRequired().HasMaxLength(100);
            builder.Property(a => a.AttachedFileName).IsRequired().HasMaxLength(1000);
            builder.Property(a => a.FileType).HasMaxLength(250);
            builder.Property(a => a.MoreInfo).HasMaxLength(500);
        }
    }
}
