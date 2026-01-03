using System.ComponentModel.DataAnnotations;

namespace SimpleSaleSystem.WebFramework.Api.ApiDto
{
     public class LoginRequestDto
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "نام کاربری الزامی است")]
        public string UserName { get; set; } = "";
        [Required(AllowEmptyStrings = false, ErrorMessage = "گذرواژه الزامی است")]
        public string Password { get; set; } = "";
    }
}
