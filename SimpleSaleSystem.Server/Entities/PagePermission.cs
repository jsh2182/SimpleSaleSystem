namespace SimpleSaleSystem.Entities
{
    public class PagePermission:BaseEntity<int>
    {
        public short PageID { get; set; }
        public int UserID { get; set; }
        public bool CanRead { get; set; }
        public bool CanInsert { get; set; }
        public bool CanUpdate { get; set; }
        public bool CanDelete { get; set; }
        public virtual PageList? PageList { get; set; }
        public virtual SystemUser? User { get; set; }

    }
}
