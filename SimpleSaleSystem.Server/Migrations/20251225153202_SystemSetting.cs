using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class SystemSetting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SystemSettings",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SettingName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SettingValue = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.ID);
                });

            migrationBuilder.InsertData(
                schema: "dbo",
                table: "SystemSettings",
                columns: new[] { "ID", "SettingName", "SettingValue" },
                values: new object[] { 1, "DefaultTaxPercent", "10" });

            migrationBuilder.CreateIndex(
                name: "IX_SystemSetting_Name",
                schema: "dbo",
                table: "SystemSettings",
                column: "SettingName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings",
                schema: "dbo");
        }
    }
}
