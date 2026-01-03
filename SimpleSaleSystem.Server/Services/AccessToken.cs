using System.IdentityModel.Tokens.Jwt;

namespace SimpleSaleSystem.Services
{
    public class AccessToken(JwtSecurityToken securityToken)
    {
        public string access_token { get; set; } = new JwtSecurityTokenHandler().WriteToken(securityToken);
        public string refresh_token { get; set; }
        public string token_type { get; set; } = "Bearer";
        public int expires_in { get; set; } = (int)(securityToken.ValidTo - DateTime.UtcNow).TotalSeconds;
        public string? token_for { get; set; } = securityToken.Payload["U_FullName"].ToString();
        public string u_mobile { get; set; } = securityToken.Payload["U_Mobile"].ToString();
    }
}
