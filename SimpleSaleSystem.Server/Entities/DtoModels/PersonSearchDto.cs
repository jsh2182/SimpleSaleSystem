namespace SimpleSaleSystem.Entities.DtoModels
{
    public class PersonSearchDto
    {
        public long? ParentPersonID { get; set; }
        public string? PersonName { get; set; }
        public string? PersonCode { get; set; }
        public string? NationalCode { get; set; }
        public string? PassportCode { get; set; }
        public string? CommercialCode { get; set; }
        public string? RegisterationNumber { get; set; }       
        public string? Mobile { get; set; }
        public string? Phone { get; set; }
        public int? StatusID { get; set; }
        public int? GroupID { get; set; }
        public bool? IsBlackListed { get; set; }
        /// <summary>
        /// Creditor: false, Debtor: true Or Both: NULL
        /// </summary>
        public bool? AccountingType { get; set; }
        public string? OrderBy { get; set; }
        public int Take { get; set; }
        public int Skip { get; set; }
    }
}
