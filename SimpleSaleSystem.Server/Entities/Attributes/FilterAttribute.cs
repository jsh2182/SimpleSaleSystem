namespace SimpleSaleSystem.Entities.Attributes
{
    public enum CompareOperations
    {
        Null,
        NotNull,
        GreaterThan,
        LessThan,
        GreaterThanOrEqual,
        LessThanOrEqual,
        Equal,
        NotEqual,
        Contains
    }
    public enum BinaryOperations
    {
        AND,
        OR,
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class FilterAttribute(CompareOperations compareCondition, string? queryPropName = null, BinaryOperations? binaryOperation = null) : Attribute
    {
        public CompareOperations CompareOperation { get; } = compareCondition;
        public BinaryOperations? BinaryOperation { get; } = binaryOperation;
        public string? QueryPropName { get; } = queryPropName;
        public FilterAttribute(CompareOperations compareCondition):this(compareCondition, null, null)
        {

        }
        public FilterAttribute(CompareOperations compareCondition, string queryPropName) : this(compareCondition, queryPropName, null)
        {

        }
    }
   
}
