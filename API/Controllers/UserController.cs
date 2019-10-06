using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
    }
}