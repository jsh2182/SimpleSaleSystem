namespace SimpleSaleSystem.Entities
{
    public class SystemUser : BaseEntity<int>
    {
        public required string UserName { get; set; }
        public string Password { get; set; } = "";
        public required string UserFullName { get; set; }
        public string? UserMobile { get; set; }
        public bool IsActive { get; set; } = true;
        public string? LoginInfo { get; set; }
        public long? OrganizationRoleID { get; set; }
        public DateTimeOffset? LastLoginDate { get; set; }
        public virtual ICollection<PagePermission>? Permissions { get; set; }
        public virtual ICollection<Person>? CreatedPeople { get; set; }
        public virtual ICollection<Invoice>? Invoices { get; set; }
        public virtual ICollection<Invoice>? Invoices_UpdateBy { get; set; }

    }
}
