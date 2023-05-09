using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
using System.Security.Claims;
using ProEventos.API.Extensions;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        public AccountController(IUserService userService, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _userService = userService;
        }

        [HttpGet("GetUser")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();

                var user = await _userService.GetUserByUserNameAsync(userName);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                if( await _userService.UserExists(userDto.UserName))
                    return BadRequest("Usuário já existe.");

                var user = await _userService.CreateAccountAsync(userDto);
                if(user != null)
                    return Ok(user);

                return BadRequest("Usuário não criado, tente novamente mais tarde!.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar registrar Usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _userService.GetUserByUserNameAsync(userLoginDto.UserName);
                if(user == null) return Unauthorized("Usuário ou Senha Invalidas.");

                var result = await _userService.CheckUserPasswordAsync(user, userLoginDto.Password);
                if(!result.Succeeded) return Unauthorized("Usuário ou Senha Invalidas.");

                return Ok(new 
                {
                    userName = user.UserName,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar realizar login Usuário. Erro: {ex.Message}");
            }
        }


        [HttpPut("UpdateUser")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _userService.GetUserByUserNameAsync(User.GetUserName());
                if(user == null) return Unauthorized("Usuário Invalido.");

                var userReturn = await _userService.UpdateAccount(userUpdateDto);
                if(userReturn == null) return NoContent();

                return Ok(userReturn);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar Usuário. Erro: {ex.Message}");
            }
        }
    }
}