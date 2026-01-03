using SimpleSaleSystem.Entities.DtoModels;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SimpleSaleSystem.WebFramework.Filters
{
    public class FieldAttribute(string pageName, string fieldName, PermissionActionType actionType = PermissionActionType.Read): ActionFilterAttribute
    {
        protected internal string PageName { get; } = pageName;
        protected internal string FieldName { get; } = fieldName;
        protected internal PermissionActionType ActionType { get; } = actionType;
    }
}
