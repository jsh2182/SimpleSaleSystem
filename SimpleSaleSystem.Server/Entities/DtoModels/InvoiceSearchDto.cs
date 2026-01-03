using SimpleSaleSystem.Entities.Attributes;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class InvoiceSearchDto
    {
        public long? InvoiceNumber { get; set; }
        public DateTime? InvoiceDateFrom { get; set; }
        public DateTime? InvoiceDateTo { get; set; }
        public long? CustomerID { get; set; }
        [Filter(CompareOperations.Contains)]
        public string?   CustomerName { get; set; }
        [Filter(CompareOperations.Contains)]
        public string? CustomerMobile { get; set; }
        public DateTime? CreationDateFrom { get; set; }
        public DateTime? CreationDateTo { get; set; }
        [Filter(CompareOperations.Contains)]
        public string? Description { get; set; }
        public bool? SentToTaxOffice { get; set; }
        public string? OrderBy { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
