using AutoMapper;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;

namespace SimpleSaleSystem.WebFramework.CustomMapping
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<SystemUser, UserDto>().ReverseMap();
        }
    }
    public class PagePermissionMappingProfile : Profile
    {
        public PagePermissionMappingProfile()
        {
            CreateMap<PagePermission, PagePermissionDto>().ReverseMap();
        }
    }
    public class PersonMappingProfile : Profile
    {
        public PersonMappingProfile()
        {
            CreateMap<Person, PersonDto>().ReverseMap();
        }
    }
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
        }
    }

  
    public class InvoiceProfile : Profile
    {
        public InvoiceProfile()
        {
            CreateMap<Invoice, InvoiceDto>().ReverseMap();
        }
    }
    public class InvoiceDetailsProfile : Profile
    {
        public InvoiceDetailsProfile()
        {
            CreateMap<InvoiceDetails, InvoiceDetailsDto>().ReverseMap();
        }
    }
}
