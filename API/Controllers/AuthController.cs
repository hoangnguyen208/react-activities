using System.Threading.Tasks;
using Application.DTO;
using Application.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class AuthController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}