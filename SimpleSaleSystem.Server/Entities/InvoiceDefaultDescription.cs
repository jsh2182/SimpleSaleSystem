using SimpleSaleSystem.Entities;

namespace SimpleSaleSystem.Server.Entities
{
    public class InvoiceDefaultDescription:BaseEntity<int>
    {
        public required string Description { get; set; }
    }
}
