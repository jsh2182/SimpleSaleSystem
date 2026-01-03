using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace SimpleSaleSystem.Entities
{
    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.ToTable("Person", "dbo");
            builder.HasKey(p => p.ID);
            builder.HasIndex(p => new { p.IsDeleted, p.IsBlackListed })
                .HasDatabaseName("IX_Person_Deleted_BlackListed").IncludeProperties(p=> new
                {
                    p.ID,
                    p.PersonName,
                    p.Phone,
                    p.PersonCode,
                    p.NationalCode,
                    p.Mobile
                });
            builder.HasIndex(p => new { p.PersonName })
                .HasDatabaseName("IX_Person_Name").IncludeProperties(p => new
                {
                    p.IsDeleted,
                    p.IsBlackListed,
                    p.Phone,
                    p.PersonCode,
                    p.NationalCode,
                    p.Mobile
                });
            builder.HasIndex(p => p.ParentPersonID).HasDatabaseName("IX_Person_ParentPersonID");
            builder.Property(p => p.ID).ValueGeneratedOnAdd();
            builder.Property(p => p.CommercialCode).HasMaxLength(30);
            builder.Property(p => p.Mobile).HasMaxLength(50);
            builder.Property(p => p.NationalCode).HasMaxLength(10);
            builder.Property(p => p.PassportCode).HasMaxLength(20);
            builder.Property(p => p.PersonAddress).HasMaxLength(1000);
            builder.Property(p => p.PersonCode).IsRequired();
            builder.Property(p => p.PersonName).HasMaxLength(150).IsRequired();
            builder.Property(p => p.CallerName).HasMaxLength(150);
            builder.Property(p => p.Gender).HasMaxLength(3);
            builder.Property(p => p.RespectTitle).HasMaxLength(20);
            builder.Property(p => p.RegisterationNumber).HasMaxLength(20);
            builder.Property(p => p.SubscriptionCode).HasMaxLength(20);
            builder.Property(p => p.PostalCode).HasMaxLength(20);
            builder.Property(p => p.Phone).HasMaxLength(50);
            builder.Property(p => p.Email).HasMaxLength(50);
            builder.Property(p => p.IsDeleted);
            builder.Property(p => p.IsBlackListed);
            builder.Property(p => p.LegalPersonality);
            builder.Property(p=>p.ProductSerials).HasMaxLength(1000);
            
            
            builder.HasOne(p => p.ParentPerson).WithMany(p => p.ChildPeople).HasForeignKey(p => p.ParentPersonID);
            builder.HasOne(p => p.CreatingUser).WithMany(p => p.CreatedPeople).HasForeignKey(p => p.CreatingUserID);
        }
    }
}
