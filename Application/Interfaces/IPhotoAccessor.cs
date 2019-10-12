using Application.DTO;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        PhotoDTO AddPhoto(IFormFile file);
        string DeletePhoto(string publicId);
    }
}