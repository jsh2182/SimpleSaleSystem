namespace SimpleSaleSystem.Entities.DtoModels
{
    public enum PermissionActionType
    {
        Read = 1,
        Insert = 2,
        Update = 4,
        Delete = 8
    }
    public enum PersonTypes
    {
        PreCustomer = 1,
        Customer,
        Personnel,
        Staff,
        Agent
    }
    public enum ServiceDetailType
    {
        Referral = 1,
        DefinedServiceCost,
        ExtraServiceCost,
        UsedParts
    }
    public enum FlowStageTypes
    {
        Service = 1,
        Person = 2
    }
    public enum ReceptionTypes
    {
        Install =1,
        Repair=2
    }
    public enum WorkPriority
    {
        VeryLow,
        Low,
        Normal,
        High,
        Emergency
    }
    public enum InvoiceTypes
    {
        Sale = 1,
        Purchase,
        /// <summary>
        /// حواله انبار
        /// </summary>
        OutOfOrder,
        ReturnFromSale,
        ReturnfromPurchase,
        /// <summary>
        /// ضایعات
        /// </summary>
        Waste,
        PreSale,
        PrePurchase,
        WarehouseReceipt,
        Transfer,
        Borrow,
        ReturnFromBorrow,
        /// <summary>
        /// داغی قطعات
        /// </summary>
        OldParts,
        /// <summary>
        /// فاکتور خدمات
        /// </summary>
        ServiceInvoice,
        DoubleDiscount
    }
    public enum InvoiceStates
    {
        Draft,
        WatingForApprove,
        Approved
    }
    public enum PaymentMethods
    {
        /// <summary>
        /// بدون تسویه
        /// </summary>
        NoSettlement,
        Cash,
        /// <summary>
        /// نقد و نسیه
        /// </summary>
        CashAndCredit
    }
    public enum InvoiceGuaranteeType
    {
       
        /// <summary>
        /// یکساله
        /// </summary>
        Year,
        /// <summary>
        /// یک مرتبه
        /// </summary>
        Time
    }
}
