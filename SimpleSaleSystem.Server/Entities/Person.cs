namespace SimpleSaleSystem.Entities
{
    public class Person:BaseEntity<int>
    {
        public int? ParentPersonID { get; set; }
        public required string PersonName { get; set; }
        public int PersonCode { get; set; }
        public string? CallerName { get; set; }
        /// <summary>
        /// حقیقی یا حقوقی(false = حقیقی)
        /// </summary>
        public bool LegalPersonality { get; set; }
        /// <summary>
        /// مرد یا زن. برای شخصیت حقوقی این فیلد مقدار نخواهد داشت
        /// </summary>
        public string? Gender { get; set; }
        public string? NationalCode { get; set; }
        public string? PassportCode { get; set; }
        public string? CommercialCode { get; set; }
        public string? RegisterationNumber { get; set; }
        /// <summary>
        /// کد اشتراک: فقط برای مشتریان استفاده می شود
        /// </summary>
        public string? SubscriptionCode { get; set; }
        /// <summary>
        /// چند شماره باید با کاما از هم جدا شود
        /// </summary>       
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? PersonAddress { get; set; }
        public string? PostalCode { get; set; }
        public string? RespectTitle { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsBlackListed { get; set; }
        /// <summary>
        /// Creditor: false, Debtor: true Or Both: NULL
        /// </summary>
        public bool? AccountingType { get; set; }
        /// <summary>
        /// برای اشخاص حقوقی مورد استفاده قرار می گیرد- جهت ارایه به سازمان مالیاتی
        /// </summary>
        public string? BranchCode { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatingUserID { get; set; }
        /// <summary>
        /// یک شخص می تواند تکنسین، نماینده، مشتری، مشتری بالقوه، پرسنل و یا هر چهار تا باشد
        /// </summary>
        public bool IsStaff { get; set; }
        /// <summary>
        /// یک شخص می تواند تکنسین، نماینده، مشتری، مشتری بالقوه، پرسنل و یا هر چهار تا باشد
        /// </summary>
        public bool IsAgency { get; set; }
        /// <summary>
        /// یک شخص می تواند تکنسین، نماینده، مشتری، مشتری بالقوه، پرسنل و یا هر چهار تا باشد
        /// </summary>
        public bool IsCustomer { get; set; }
        /// <summary>
        /// یک شخص می تواند تکنسین، نماینده، مشتری، مشتری بالقوه، پرسنل و یا هر چهار تا باشد
        /// </summary>
        public bool IsPreCustomer { get; set; }
        /// <summary>
        /// یک شخص می تواند تکنسین، نماینده، مشتری، مشتری بالقوه، پرسنل و یا هر چهار تا باشد
        /// </summary>
        public bool IsPersonnel { get; set; }
        /// <summary>
        /// سریال محصولات خریداری شد
        /// </summary>
        public string? ProductSerials { get; set; } = "";

        public virtual SystemUser? CreatingUser { get; set; }
        public virtual Person? ParentPerson { get; set; }
        public virtual ICollection<Person>? ChildPeople { get; set; }
        public virtual ICollection<Invoice>? Invoices { get; set; }

    }
}
