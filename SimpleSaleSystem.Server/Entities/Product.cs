namespace SimpleSaleSystem.Entities
{
    public class Product:BaseEntity<long>
    {
        public int ProductCode { get; set; }
        public required string ProductName { get; set; } = string.Empty;
        public string? ProductModel { get; set; }
        public string? BarCode { get; set; } = "";
        public bool IsDeleted { get; set; }
        public decimal DefaultSalePrice { get; set; } = 0;
        public bool PriceIsEditableInSelect { get; set; }
        public bool CountIsEditableInSelect { get; set; }

        public virtual ICollection<InvoiceDetails>? InvoiceDetails { get; set; }
    }
}
