using SimpleSaleSystem.Entities;
using System.Threading.Tasks;

namespace SimpleSaleSystem.Services
{
    public interface IJwtService
    {
        AccessToken Generate(SystemUser user);
    }
}