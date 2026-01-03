using SimpleSaleSystem.Common.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class PersonDto : IValidatableObject
    {
        public long ID { get; set; }
        public long? ParentPersonID { get; set; }
        [Required(ErrorMessage ="نام شخص الزامی است.")]
        public string? PersonName { get; set; }
        public string? CallerName { get; set; }
        public int PersonCode { get; set; }
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
        public bool IsBlackListed { get; set; }
        /// <summary>
        /// Creditor: false, Debtor: true Or Both: NULL
        /// </summary>
        public bool? AccountingType { get; set; }
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
        /// سریال محصولات خریداری شده
        /// </summary>
        public string? ProductSerials { get; set; } = "";

        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {

            if (Mobile.HasValue(false))
            {
               if(Mobile.Length < 11)
                {
                    yield return new ValidationResult("طول شماره همراه نمی تواند کمتر از 11 باشد", [nameof(Mobile)]);
                }
                foreach (char c in Mobile)
                {
                    if (!char.IsDigit(c) && c != ',')
                    {
                        yield return new ValidationResult("موبایل تنها می تواند شامل عدد باشد", [nameof(Mobile)]);
                    }
                }
            }
            if (Phone.HasValue(false))
            {
                if (Phone.Length < 8)
                {
                    yield return new ValidationResult("طول شماره همراه نمی تواند کمتر از 11 باشد", [nameof(Phone)]);
                }
                foreach (char c in Phone)
                {
                    if (!char.IsDigit(c) && c != ',')
                    {
                        yield return new ValidationResult("شماره تلفن تنها می تواند شامل عدد باشد", [nameof(Phone)]);
                    }
                }
            }
            if(!IsAgency && !IsCustomer && !IsPreCustomer && !IsPersonnel && !IsStaff)
            {
                yield return new ValidationResult("نوع شخص مشخص نشده است. دست کم یکی از انواع نماینده، تکنسین، مشتری، مشتری بالقوه و یا پرسنل باید مشخص شود", [nameof(IsAgency)]); 
            }
        }
    }
}
