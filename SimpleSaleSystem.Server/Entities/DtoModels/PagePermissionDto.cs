namespace SimpleSaleSystem.Entities.DtoModels
{
    public class PagePermissionDto
    {
        public PagePermissionDto()
        {
            Children = [];
        }
        public short PageID { get; set; }
        public string? PageName { get; set; }
        public string? PersianName { get; set; }
        public int UserID { get; set; }
        public string? UserName { get; set; }
        public bool? CanRead { get; set; }
        public bool? CanInsert { get; set; }
        public bool? CanUpdate { get; set; }
        public bool? CanDelete { get; set; }
        public bool IsReport { get; set; }
        public List<(int ID, string Name)> Children { get; set; }

    }
}
