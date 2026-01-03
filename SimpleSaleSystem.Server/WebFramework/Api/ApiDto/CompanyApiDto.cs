using Microsoft.AspNetCore.Http;

namespace SimpleSaleSystem.WebFramework.Api.ApiDto
{
    /// <summary>
    /// به دلیل استفاده از IFormFile باید یک کلاس در این لایه ساخته می شد.
    /// </summary>
    public class CompanyApiDto
    {
        public required string CompanyName { get; set; }
        public IFormFile? CompanyLogo { get; set; }
        public string? CompanyAddress { get; set; }
        public required string ManagerMobile { get; set; }
        public string? CompanyPhone { get; set; }
        public string? UserFullName { get; set; }
        public required string ManagerUserName { get; set; }
        public string? TaxOfficePrivateKey { get; set; }
        public string? UniqueTaxIdentifier { get; set; }
        public string? CommercialCode { get; set; }
        public string? RegistrationNumber { get; set; }
    }
}
