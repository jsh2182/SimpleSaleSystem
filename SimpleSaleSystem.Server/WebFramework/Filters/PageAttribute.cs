using SimpleSaleSystem.Entities.DtoModels;

namespace SimpleSaleSystem.WebFramework.Filters
{
    [AttributeUsage(AttributeTargets.Method)]
    public class PageAttribute(string pageName, PermissionActionType actionType) : Attribute
    {
        protected internal string PageName { get; } = pageName;
        protected internal PermissionActionType ActionType { get; } = actionType;
    }
}
