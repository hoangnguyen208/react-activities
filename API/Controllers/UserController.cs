using System.Threading.Tasks;
using Application.DTO;
using Application.User;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<UserDTO>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<UserDTO>> Details(string username)
        {
            return await Mediator.Send(new Details.Query{Username = username});
        }
    }
}