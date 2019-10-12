using System.Linq;
using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDTO>();
            CreateMap<UserActivity, AttendeeDTO>()
                .ForMember(des => des.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(des => des.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(des => des.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}