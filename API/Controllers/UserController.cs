using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTO;
using Application.User;
using MediatR;
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

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDTO>>> GetUserActivities(string username, string predicate)
        {
            return await Mediator.Send(new ListUserActivities.Query{Username = username, Predicate = predicate });
        }
    }
}