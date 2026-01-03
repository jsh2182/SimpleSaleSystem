using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities.DtoModels;
using SimpleSaleSystem.Services;
using SimpleSaleSystem.WebFramework.Filters;
using Microsoft.AspNetCore.Mvc;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController(IPagePermissionRepository pagePermissionRepo) : ControllerBase
    {
        private readonly IPagePermissionRepository _pagePermissionRepo = pagePermissionRepo;

        [ManagerAccess]
        [HttpPost("[action]")]
        public async Task<ActionResult> GrantOrRemovePermission(List<PagePermissionDto> model, CancellationToken cancellationToken)
        {
            bool result = await PermissionManagement.GrantOrRemovePermission(model, _pagePermissionRepo, cancellationToken);
            if (result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
