using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemSettingController(IRepository<SystemSetting> settingRepo) : ControllerBase
    {
       private readonly IRepository<SystemSetting> _settingRepo = settingRepo;
        
        [HttpGet]
        public async Task<ActionResult> Get(string name, CancellationToken cancellationToken)
        {
            var setting = await _settingRepo.TableNoTracking.FirstOrDefaultAsync(s => s.SettingName.ToLower() == name.ToLower(), cancellationToken);
            return Ok(setting?.SettingValue ?? "");
        }
    }
}
