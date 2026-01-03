using System.ComponentModel.DataAnnotations;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class InvoiceDefaultDescriptionDto
    {
        [Required(AllowEmptyStrings =false, ErrorMessage ="شرح الزامی است.")]
        public string Description { get; set; } = "";
        public int ID { get; internal set; }
    }
}
