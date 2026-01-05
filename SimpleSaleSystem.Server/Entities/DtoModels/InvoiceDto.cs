using SimpleSaleSystem.Common.Utilities;
using System.ComponentModel.DataAnnotations;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class InvoiceDto
    {
        public long ID { get; set; }
        public int? CustomerID { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string PInvoiceDate => InvoiceDate.ToLocalTime().ToPersian();
        [MaxLength(1000, ErrorMessage = "طول توضیحات نمی تواند بیشتر از 1000 کاراکتر باشد.")]
        public string? Description { get; set; }
        public long InvoiceNumber { get; set; }
        public string? ManualInvoiceNumber { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountAmount { get; set; }
        public InvoiceTypes InvoiceType { get; set; }
        public InvoiceStates InvoiceState { get; set; }
        public DateTime? SentToCustomerDate { get; set; }
        public string PSentToCustomerDate => SentToCustomerDate.HasValue ? SentToCustomerDate?.ToLocalTime().ToPersian()+"."+ SentToCustomerDate.Value.ToLocalTime().ToString("HH:mm"):"";
        public long? ParentInvoiceID { get; set; }
        public PaymentMethods? PaymentMethod { get; set; }
        public decimal PaidAmount { get; set; }
        public bool IsFormal { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerMobile { get; set; }
        [MaxLength(1000, ErrorMessage = "طول نشانی نمی تواند بیشتر از 1000 کاراکتر باشد.")]
        public string? CustomerAddress { get; set; }
        public int GuaranteeTime { get; set; }
        /// <summary>
        /// سریال محصولاتی که فاکتور به ازای آنها صادر شده است
        /// </summary>
        public string? ProductSerials { get; set; } = "";
        public InvoiceGuaranteeType GuaranteeType { get; set; }
        public IEnumerable<InvoiceDetailsDto> InvoiceDetails { get; set; } = [];
        public decimal InvoiceNetPrice { get; set; }
        public decimal InvoiceTotalPrice { get; set; }
        [MaxLength(150, ErrorMessage ="طول نام تماس گیرنده نمی تواند بیشتر از 150 کاراکتر باشد.")]
        public string? CallerName { get; set; }
        [MaxLength(1000, ErrorMessage = "طول سایر توضیحات نمی تواند بیشتر از 1000 کاراکتر باشد.")]
        public string? MoreDescription { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? UpdatingDate { get; set; }
        public string CreateByName { get; set; } = "";
        public string PCreationDate=> CreationDate.ToLocalTime().ToPersian();
        public string UpdateByName { get; set; } = "";
        public string SentToCustomerByName { get; set; } = "";
        public string PUpdatingDate => UpdatingDate > DateTime.MinValue? UpdatingDate.Value.ToLocalTime().ToPersian():"";
    }
}
