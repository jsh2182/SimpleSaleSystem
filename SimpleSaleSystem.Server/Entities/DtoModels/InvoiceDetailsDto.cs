namespace SimpleSaleSystem.Entities.DtoModels
{
    public class InvoiceDetailsDto
    {
        public long ID { get; set; }
        public long InvoiceID { get; set; }

        /// <summary>
        /// <br>To Edit Row Without Disturbing The Rows Order.</br>
        /// <br> To Delete A Row When Its ID Is Zero.</br>
        /// <br> To Insert A Row Between Two Other Rows. </br>
        /// </summary>
        public int RowIndex { get; set; }
        public int? StorageID { get; set; }
        public long ProductID { get; set; }
        public string? ProductSerial { get; set; }
        public decimal ProductCount { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice => ProductCount * UnitPrice;
        public decimal NetPrice => ProductCount * UnitPrice - Discount + Tax;
        public int? CountingUnit { get; set; }
        public string? ItemDescription { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
        public decimal TaxPercent { get; set; }
        public decimal DiscountPercent { get; set; }
        /// <summary>
        /// Saves Parent For ReturnFromBorrow, ReturnFromSale And ReturnFromPurchase
        /// </summary>
        public long? ParentDetailID { get; set; }
        public decimal Discount2 { get; set; }
        public decimal PurchasePrice { get; set; }
        public string? ProductName { get; set; }
        public string? ProductModel { get; set; }
        public int ProductCode { get; set; }
        public string? StorageName { get; set; }
        public bool SignedForDelete { get; set; }
        public bool IsFaultySerial { get; set; }
    }
}
