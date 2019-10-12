using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.DTO;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<UserDTO> { }
        public class Handler : IRequestHandler<Query, UserDTO>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
            }
            public async Task<UserDTO> Handle(Query request, CancellationToken cancellationToken)
            {
                // var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                var user = await _userManager.FindByEmailAsync(_userAccessor.GetCurrentUserEmail());

                return new UserDTO
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                    Email = user.Email
                };
            }
        }
    }
}