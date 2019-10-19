using System.Threading.Tasks;
using Application.DTO;

namespace Application.Interfaces
{
    public interface IProfileReader
    {
        Task<UserDTO> ReadProfile(string username);        
    }
}