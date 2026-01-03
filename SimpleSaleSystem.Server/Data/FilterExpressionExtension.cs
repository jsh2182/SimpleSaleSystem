using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Entities.Attributes;
using System.Linq.Expressions;
using System.Reflection;

namespace SimpleSaleSystem.Data
{
    public class FilterExpressionExtension<TQuery> where TQuery : class
    {
        public static IQueryable<TQuery> Filter<TFilter>(IQueryable<TQuery> query, TFilter filter)
        {
            ArgumentNullException.ThrowIfNull(filter, nameof(filter));
            ArgumentNullException.ThrowIfNull(query, nameof(query));
            PropertyInfo[]? filterProps = filter.GetType().GetProperties();
            PropertyInfo[]? queryProps = typeof(TQuery).GetProperties();
            ArgumentNullException.ThrowIfNull(filterProps);
            ArgumentNullException.ThrowIfNull(queryProps);
            foreach (PropertyInfo filterProp in filterProps)
            {
                if (filterProp == null || !filterProp.CanRead || filterProp.PropertyType.IsNotPublic)
                {
                    continue;
                }
                object? value = filterProp.GetValue(filter);
                if (filterProp.PropertyType == typeof(string))
                {
                    if (string.IsNullOrWhiteSpace(value?.ToString()))
                    {
                        continue;
                    }
                }
                else if (value == null)
                {
                    continue;
                }

                string propName = filterProp.Name;
                FilterAttribute? attr = filterProp.GetCustomAttribute<FilterAttribute>();
                CompareOperations? compareType = attr?.CompareOperation;

                string? queryPropName = attr?.QueryPropName;
                if (!queryPropName.HasValue())
                {
                    queryPropName = propName.Replace("From", "").Replace("To", "");
                }

                PropertyInfo? queryProp = queryProps.FirstOrDefault(p => p.Name.Equals(queryPropName, StringComparison.CurrentCultureIgnoreCase));
                if (queryProp == null)
                {
                    continue;
                }
                if (compareType == null && filterProp.PropertyType != typeof(bool) && filterProp.PropertyType != typeof(bool?))
                {
                    Type? propType = queryProp.PropertyType;
                    if (queryProp.PropertyType.IsGenericType && queryProp.PropertyType.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
                    {
                        propType = Nullable.GetUnderlyingType(propType);
                    }
                    if (propType != value.GetType())
                    {
                        continue;
                    }
                }
                ParameterExpression queryParam = Expression.Parameter(typeof(TQuery), queryPropName);
                MemberExpression memberExpression = Expression.PropertyOrField(queryParam, queryPropName);
                BinaryExpression? binaryExpression = null;
                ConstantExpression? constantExp = null;
                bool isNullable = Nullable.GetUnderlyingType(queryProp.PropertyType) != null;
                bool filterPropIsBool = filterProp.PropertyType == typeof(bool?) || filterProp.PropertyType == typeof(bool) && compareType != null;
                var qryPropType = queryProp.PropertyType;

                if (qryPropType == typeof(bool))
                {
                    constantExp = Expression.Constant(new { Value = (bool)value });
                }
                else if (qryPropType == typeof(bool?))
                {
                    constantExp = Expression.Constant(new { Value = (bool?)value });
                }
                else if (qryPropType == typeof(string))
                {
                    SetExp<string>();
                }
                else if (qryPropType == typeof(short))
                {
                    SetExp<short>();
                }
                else if (qryPropType == typeof(short?))
                {
                    SetExp<short?>();
                }
                else if (qryPropType == typeof(int))
                {
                    SetExp<int>();
                }
                else if (qryPropType == typeof(int?))
                {
                    SetExp<int?>();
                }
                else if (qryPropType == typeof(long))
                {
                    SetExp<long>();
                }
                else if (qryPropType == typeof(long?))
                {
                    SetExp<long?>();
                }
                else if (queryProp.PropertyType == typeof(float))
                {
                    SetExp<float>();
                }
                else if (queryProp.PropertyType == typeof(float?))
                {
                    SetExp<float?>();
                }
                else if (queryProp.PropertyType == typeof(double))
                {
                    SetExp<double>();
                }
                else if (queryProp.PropertyType == typeof(double?))
                {
                    SetExp<double?>();
                }
                else if (queryProp.PropertyType == typeof(decimal))
                {
                    SetExp<decimal>();
                }
                else if (queryProp.PropertyType == typeof(decimal?))
                {
                    SetExp<decimal?>();
                }
                else if (queryProp.PropertyType == typeof(DateTime))
                {
                    SetExp<DateTime>();
                }
                else if (queryProp.PropertyType == typeof(DateTime?))
                {
                    SetExp<DateTime?>();
                }
                MemberExpression? variableRef = null;
                if (constantExp != null)
                {
                    variableRef = Expression.Property(constantExp, "Value");
                }
                if (propName.EndsWith("From"))
                {
                    binaryExpression = Expression.GreaterThanOrEqual(memberExpression, variableRef);
                }
                else if (propName.EndsWith("To"))
                {
                    if (filterProp.PropertyType == typeof(DateTime) || filterProp.PropertyType == typeof(DateTime?))
                    {
                        value = Convert.ToDateTime(value).AddDays(1);
                        if (isNullable)
                        {
                            constantExp = Expression.Constant(new { ValueTo = (DateTime?)value });
                        }
                        else
                        {
                            constantExp = Expression.Constant(new { ValueTo = (DateTime)value });
                        }

                        variableRef = Expression.Property(constantExp, "ValueTo");
                    }
                    binaryExpression = Expression.LessThan(memberExpression, variableRef);
                }
                else if (filterProp.PropertyType == typeof(string) && compareType == CompareOperations.Contains)
                {
                    MethodInfo? methodInfo = typeof(string).GetMethod("Contains", [typeof(string)]);
                    if (methodInfo != null && variableRef != null)
                    {
                        Expression condition = Expression.Call(memberExpression, methodInfo, variableRef);
                        var lambda = Expression.Lambda<Func<TQuery, bool>>(condition, queryParam);
                        query = query.Where(lambda);
                    }
                }
                else if (variableRef != null)
                {
                    binaryExpression = Expression.Equal(memberExpression, variableRef);
                }
                if (binaryExpression != null)
                {
                    var lamda = Expression.Lambda<Func<TQuery, bool>>(binaryExpression, queryParam);
                    query = query.Where(lamda);
                }

                void SetExp<T>()
                {
                    if (filterPropIsBool)
                    {
                        if (compareType == CompareOperations.NotNull)
                        {
                            binaryExpression = Expression.NotEqual(memberExpression, Expression.Constant(null, queryProp.PropertyType));
                        }
                        else if (compareType == CompareOperations.Null)
                        {
                            binaryExpression = Expression.Equal(memberExpression, Expression.Constant(null, queryProp.PropertyType));
                        }
                    }
                    else
                    {
                        constantExp = Expression.Constant(new { Value = (T)value });
                    }
                }

            }
            return query;
        }
    }
}
