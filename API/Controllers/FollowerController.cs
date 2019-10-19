using System.Collections.Generic;
using System.Threading.Tasks;
using Application.DTO;
using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/profile")]
    public class FollowerController : BaseController
    {
        [HttpPost("{email}/follow")]
        public async Task<ActionResult<Unit>> Follow(string email)
        {
            return await Mediator.Send(new Add.Command{Email = email});
        }

        [HttpDelete("{email}/follow")]
        public async Task<ActionResult<Unit>> Unfollow(string email)
        {
            return await Mediator.Send(new Delete.Command{Email = email});
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<UserDTO>>> Following(string username, string predicate)
        {
            return await Mediator.Send(new List.Query{Username = username, Predicate = predicate});
        }
    }
}