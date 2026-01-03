namespace SimpleSaleSystem.Entities
{
    public class SystemSetting:BaseEntity<int>
    {
        public required string SettingName { get; set; }
        public string? SettingValue { get; set; }
    }
}
