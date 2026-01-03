using SimpleSaleSystem.Common;
using SimpleSaleSystem.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SimpleSaleSystem.Services
{
    public class JwtService(IOptionsSnapshot<SiteSettings> settings) : IJwtService
    {
        private readonly SiteSettings _siteSetting = settings.Value;

        public AccessToken Generate(SystemUser user)
        {
            var secretKey = Encoding.UTF8.GetBytes(_siteSetting.JwtSettings.SecretKey); // longer that 32 character
            var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature);

            var encryptionkey = Encoding.UTF8.GetBytes(_siteSetting.JwtSettings.Encryptkey); //must be 16 character
            var encryptingCredentials = new EncryptingCredentials(new SymmetricSecurityKey(encryptionkey), SecurityAlgorithms.Aes128KW, SecurityAlgorithms.Aes128CbcHmacSha256);

            //var certificate = new X509Certificate2("d:\\aaaa2.cer"/*, "P@ssw0rd"*/);
            //var encryptingCredentials = new X509EncryptingCredentials(certificate);

            var claims = _getClaims(user);

            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = _siteSetting.JwtSettings.Issuer,
                Audience = _siteSetting.JwtSettings.Audience,
                IssuedAt = DateTime.UtcNow,
                NotBefore = DateTime.UtcNow.AddMinutes(_siteSetting.JwtSettings.NotBeforeMinutes),
                Expires = DateTime.UtcNow.AddMinutes(_siteSetting.JwtSettings.ExpirationMinutes),
                SigningCredentials = signingCredentials,
                EncryptingCredentials = encryptingCredentials,
                Subject = new ClaimsIdentity(claims)
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var securityToken = tokenHandler.CreateJwtSecurityToken(descriptor);

            //string encryptedJwt = tokenHandler.WriteToken(securityToken);

            return new  AccessToken(securityToken);
        }

        private IEnumerable<Claim> _getClaims(SystemUser user)
        {

            var list = new List<Claim>
            {
                new(ClaimTypes.Name, user.UserName),
                new (ClaimTypes.NameIdentifier, user.ID.ToString()),
                new ("U_FullName", user.UserFullName),
                new ("U_Mobile", user.UserMobile??"")
            };

            return  list;
        }
    }
}
