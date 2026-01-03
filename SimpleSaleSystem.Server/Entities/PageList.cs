namespace SimpleSaleSystem.Entities
{
    public class PageList:BaseEntity<short>
    {
        public short? ParentPageID { get; set; }
        public required string PageName { get; set; }
        public required string PersianName { get; set; }
        public bool IsReport { get; set; }
        public virtual PageList? ParentPage { get; set; }
        public virtual ICollection<PagePermission>? PagePermissions { get; set; }
        public virtual ICollection<PageList>? ChildPages { get; set; }
    }
}
