namespace SimpleSaleSystem.Entities
{
    public class InvoiceDetails:BaseEntity<long>
    {
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
        public decimal TotalPrice { get; set; }
        public decimal PureTotalPrice { get; set; }
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
        public decimal PurchasePrice { get; set; }
        public virtual Product? Product { get; set; }
        public virtual Invoice? Invoice { get; set; }
    }
}
