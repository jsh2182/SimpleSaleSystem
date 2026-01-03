using SimpleSaleSystem.Entities.Attributes;

namespace SimpleSaleSystem.Entities.DtoModels
{
    public class ProductSearchDto
    {
        public string ProductName { get; set; } = "";
        public int? ProductCode { get; set; }
        public string ProductModel { get; set; } = "";
        public string BarCode { get; set; } = "";
        public int Skip { get; set; }
        public int Take { get; set; }
        public string? OrderBy { get; set; }
    }
}
