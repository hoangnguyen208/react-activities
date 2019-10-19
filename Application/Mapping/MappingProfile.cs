using System.Linq;
using Application.Activities;
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
                .ForMember(des => des.Email, opt => opt.MapFrom(src => src.AppUser.Email))
                .ForMember(des => des.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(des => des.Following, opt => opt.MapFrom<FollowingResolver>());
            
            CreateMap<Comment, CommentDTO>()
                .ForMember(des => des.Username, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(des => des.DisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(des => des.Email, opt => opt.MapFrom(src => src.Author.Email))
                .ForMember(des => des.Image, opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}