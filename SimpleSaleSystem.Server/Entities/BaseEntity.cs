namespace SimpleSaleSystem.Entities
{
    /// <summary>
    /// This interface will be used to specify the classes for which a table will be created in DbContext.
    /// </summary>
    public interface IEntity
    {

    }
    public abstract class BaseEntity<TKey>:IEntity
    {
        public required TKey ID { get; set; }
    }
}
