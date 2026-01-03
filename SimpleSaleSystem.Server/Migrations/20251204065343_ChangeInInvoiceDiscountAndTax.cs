using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeInInvoiceDiscountAndTax : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaxFee",
                schema: "dbo",
                table: "Invoice",
                newName: "TaxAmount");

            migrationBuilder.RenameColumn(
                name: "Discount",
                schema: "dbo",
                table: "Invoice",
                newName: "DiscountAmount");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                schema: "dbo",
                table: "Invoice",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxPercent",
                schema: "dbo",
                table: "Invoice",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TaxPercent",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.RenameColumn(
                name: "TaxAmount",
                schema: "dbo",
                table: "Invoice",
                newName: "TaxFee");

            migrationBuilder.RenameColumn(
                name: "DiscountAmount",
                schema: "dbo",
                table: "Invoice",
                newName: "Discount");
        }
    }
}
