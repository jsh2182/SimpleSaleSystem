using System.ComponentModel.DataAnnotations;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class ProductDto
    {
        public long ID { get; set; }
        public int ProductCode { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "نام کالا الزامی است")]
        public string ProductName { get; set; } = "";
        public string ProductModel { get; set; } = "";
        public string? BarCode { get; set; } = "";
        public decimal DefaultSalePrice { get; set; } = 0;
        public bool PriceIsEditableInSelect { get; set; }
        public bool CountIsEditableInSelect { get; set; }
        public decimal DefaultCount => !CountIsEditableInSelect ? 1 : 0;
    }
}
