using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeInInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DestinationStorageID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "ManualDocDesc",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "PaymentChequeFunctionID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "ReturnedChqBed",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TargetAccountCat",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TargetAccountID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TaxID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TaxInquiryID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TaxInquiryStatus",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "TaxOfficeRefNumber",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.AddColumn<int>(
                name: "GuaranteeTime",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GuaranteeType",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GuaranteeTime",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "GuaranteeType",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.AddColumn<int>(
                name: "DestinationStorageID",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManualDocDesc",
                schema: "dbo",
                table: "Invoice",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "PaymentChequeFunctionID",
                schema: "dbo",
                table: "Invoice",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ReturnedChqBed",
                schema: "dbo",
                table: "Invoice",
                type: "decimal(20,2)",
                precision: 20,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TargetAccountCat",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TargetAccountID",
                schema: "dbo",
                table: "Invoice",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxID",
                schema: "dbo",
                table: "Invoice",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxInquiryID",
                schema: "dbo",
                table: "Invoice",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxInquiryStatus",
                schema: "dbo",
                table: "Invoice",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxOfficeRefNumber",
                schema: "dbo",
                table: "Invoice",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
