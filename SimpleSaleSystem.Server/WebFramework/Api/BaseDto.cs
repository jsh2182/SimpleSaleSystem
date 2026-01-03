//using AutoMapper;
//using SimpleSaleSystem.Entities;

//namespace SimpleSaleSystem.WebFramework.Api
//{
//    public abstract class BaseDto<TDto, TEntity, TKey>
//        where TDto : class, new()
//        where TEntity : BaseEntity<TKey>, new()
//    {
//        public TKey Id { get; set; }

//        public TEntity ToEntity()
//        {
//            return _mapper.Map<TEntity>(CastToDerivedClass(this));
//        }

//        public TEntity ToEntity(TEntity entity)
//        {
//            return _mapper.Map(CastToDerivedClass(this), entity);
//        }

//        public static TDto FromEntity(TEntity model)
//        {
//            return _mapper.Map<TDto>(model);
//        }

//        protected TDto CastToDerivedClass(BaseDto<TDto, TEntity, TKey> baseInstance)
//        {
//            return Mapper.Map<TDto>(baseInstance);
//        }

//        public void CreateMappings(Profile profile)
//        {
//            var mappingExpression = profile.CreateMap<TDto, TEntity>();

//            var dtoType = typeof(TDto);
//            var entityType = typeof(TEntity);
//            //Ignore any property of source (like Post.Author) that dose not contains in destination 
//            foreach (var property in entityType.GetProperties())
//            {
//                if (dtoType.GetProperty(property.Name) == null)
//                    mappingExpression.ForMember(property.Name, opt => opt.Ignore());
//            }

//            CustomMappings(mappingExpression.ReverseMap());
//        }

//        public virtual void CustomMappings(IMappingExpression<TEntity, TDto> mapping)
//        {
//        }
//    }
//}
