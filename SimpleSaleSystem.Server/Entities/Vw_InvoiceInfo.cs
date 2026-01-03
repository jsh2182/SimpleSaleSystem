namespace SimpleSaleSystem.Entities
{
    public class Vw_InvoiceInfo: BaseEntity<long>
    {
        public string? CallerName { get; set; } = "";
        public int CreateByID { get; set; }
        public string CreateByName { get; set; } = "";
        public DateTime CreationDate { get; set; }
        public int? CustomerID { get; set; }
        public string? CustomerMobile { get; set; } = "";
        public string? CustomerName { get; set; } = "";
        public string? CustomerPhone { get; set; } = "";
        public string? Description { get; set; } = "";
        public int GuaranteeTime { get; set; }
        public int GuaranteeType { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal InvoiceNetPrice { get; set; }
        public long InvoiceNumber { get; set; }
        public decimal InvoiceTotalPrice { get; set; }
        public string? ProductSerials { get; set; } = "";
        public DateTime? SentToCustomerDate { get; set; }
        public decimal TaxAmount { get; set; }
        public int? UpdateByID { get; set; }
        public string? UpdateByName { get; set; } = "";
        public DateTime? UpdatingDate { get; set; }
    }
}
