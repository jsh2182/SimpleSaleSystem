using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeInUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                schema: "dbo",
                table: "SystemUser",
                columns: new[] { "ID", "IsActive", "LastLoginDate", "LoginInfo", "OrganizationRoleID", "Password", "UserFullName", "UserMobile", "UserName" },
                values: new object[] { 1, true, null, null, null, "EU/iHN2gTDHERoJVW/i5ZqLustJGD1egyntDOUYgSSg=", "super", null, "super" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "dbo",
                table: "SystemUser",
                keyColumn: "ID",
                keyValue: 1);
        }
    }
}
