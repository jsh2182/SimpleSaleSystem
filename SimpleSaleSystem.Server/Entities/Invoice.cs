using SimpleSaleSystem.Entities.DtoModels;

namespace SimpleSaleSystem.Entities
{
    public class Invoice:BaseEntity<long>
    {
        public int? CustomerID { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string? Description { get; set; }
        public long InvoiceNumber { get; set; }
        public string? ManualInvoiceNumber { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? UpdatingDate { get; set; }
        public bool IsDeleted { get; set; }
        public int CreateByID { get; set; }
        public int? UpdateByID { get; set; }
        public int? SentToCustomerByID { get; set; }
        public InvoiceTypes InvoiceType { get; set; }
        /// <summary>
        /// 0:Draft, 1:WatingForApprove, 2: Approved
        /// </summary>
        public InvoiceStates InvoiceState { get; set; }
        public DateTime? SentToCustomerDate { get; set; }
        public long? ParentInvoiceID { get; set; }
        public PaymentMethods? PaymentMethod { get; set; }
        public decimal PaidAmount { get; set; }
        public bool IsFormal { get; set; }
        public decimal InvoiceTotalPrice { get; set; }
        public decimal InvoiceNetPrice { get; set; }
        public int GuaranteeTime { get; set; }
        /// <summary>
        /// سریال محصولاتی که فاکتور به ازای آنها صادر شده است
        /// </summary>
        public string? ProductSerials { get; set; } = "";
        public string? CallerName { get; set; }
        public string? MoreDescription { get; set; }
        public InvoiceGuaranteeType GuaranteeType { get; set; }
        public virtual Invoice? ParentInvoice { get; set; }
        public virtual SystemUser? CreatingUser { get; set; }
        public virtual SystemUser? UpdatingUser { get; set; }
        public virtual SystemUser? SentToCustomerUser { get; set; }
        public virtual Person? Person { get; set; }
        public virtual ICollection<Invoice>? ChildInvoices { get; set; }
        public virtual ICollection<InvoiceDetails>? InvoiceDetails { get; set; }
    }
}
