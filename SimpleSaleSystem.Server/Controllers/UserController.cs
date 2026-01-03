using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;
using SimpleSaleSystem.Services;
using SimpleSaleSystem.WebFramework.Api;
using SimpleSaleSystem.WebFramework.Api.ApiDto;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserRepository userRepository, IJwtService jwtService, IMapper mapper) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IJwtService _jwtService = jwtService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<ActionResult<AccessToken>> Login(LoginRequestDto model, CancellationToken cancellationToken)
        {
            var user = await _userRepository.FindByUserAndPass(model.UserName, model.Password, cancellationToken);
            if (user == null)
            {
                return BadRequest("نام کاربری یا رمز عبور اشتباه است");
            }
            var jwt = _jwtService.Generate(user);
            //نیاز به منتظر ماندن برای دریافت نتیجه بروزرسانی تاریخ ورود به سیستم نیست 
            _userRepository.UpdateLastLoginDateAsync(user, cancellationToken);
            return Ok(jwt);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<List<SystemUser>>> GetAll(CancellationToken cancellationToken)
        {
            List<SystemUser> users = await _userRepository.TableNoTracking.Where(u=>u.UserName.ToLower() !="super").ToListAsync(cancellationToken);
            return Ok(new { list = users });
        }

        [HttpGet("{id}")]
        public async Task<ApiResult<SystemUser>> Get(int id, CancellationToken cancellationToken)
        {
            SystemUser? user = await _userRepository.GetByIDAsync(cancellationToken, id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<ApiResult<SystemUser>> Create(UserDto model, CancellationToken cancellationToken)
        {
            SystemUser user = _mapper.Map<SystemUser>(model);
            user.Password = user.UserName;
            await _userRepository.AddAsync(user, cancellationToken);
            return user;
        }

        [HttpPut("[action]")]
        public async Task<ApiResult> Update([FromBody] UserDto model, CancellationToken cancellationToken)
        {
            SystemUser? user = await _userRepository.GetByIDAsync(cancellationToken, model.ID);
            string oldPassword = user.Password;
            if (user == null)
            {
                return NotFound();
            }
            _mapper.Map(model, user);
            user.Password = oldPassword;
            await _userRepository.UpdateAsync(user, cancellationToken);
            return Ok();
        }
        [HttpPut("[action]")]
        public async Task<ApiResult> UpdateMe(UserDto model, CancellationToken cancellationToken)
        {
            var identity = Request.HttpContext.User.Identity;
            int userId = identity.GetUserId<int>();
            model.ID = userId;
            SystemUser? user = await _userRepository.GetByIDAsync(cancellationToken, userId);
            if (user == null)
            {
                return NotFound();
            }
            //_mapper.Map(model, user);
            user.UserFullName = model.UserFullName;
            if (model.UserName.HasValue())
                user.UserName = model.UserName;
            if (model.Password.HasValue())
                user.Password = SecurityHelper.GetSha256Hash(model.Password);
            await _userRepository.UpdateAsync(user, cancellationToken);
            return Ok();
        }

        [HttpDelete("[action]")]
        public async Task<ActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            await _userRepository.DeleteAsync(id, cancellationToken);
            return Ok("Success");
        }
    }
}
