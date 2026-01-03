using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class InvocieDefaultDEsc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvoiceDefaultDescriptions",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDefaultDescriptions", x => x.ID);
                });

            migrationBuilder.InsertData(
                schema: "dbo",
                table: "InvoiceDefaultDescriptions",
                columns: new[] { "ID", "Description" },
                values: new object[,]
                {
                    { 1, "نرم افزارحضور و غیاب تحت وب -لایسنس یکساله" },
                    { 2, "تنظیم روتر جهت استفاده از آی پی استاتیک" },
                    { 3, "تنظیم مودم جهت استفاده از آی پی استاتیک" },
                    { 4, "نرم افزار انتقال اطلاعات از برنامه دیتابیس پالیز به چارگون" },
                    { 5, "نصب و راه اندازی آنلاین سنتر بصورت اینترنتی" },
                    { 6, "نصب و راه اندازی اینترنتی نرم افزار حضور غیاب" },
                    { 7, "لایسنس یکساله نرم افزار حضور و غیاب" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceDefaultDescriptions",
                schema: "dbo");
        }
    }
}
