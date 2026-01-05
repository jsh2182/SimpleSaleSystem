using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class SentToCustomerByToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SentToCustomerByID",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_SentToCustomerByID",
                schema: "dbo",
                table: "Invoice",
                column: "SentToCustomerByID");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoice_SystemUser_SentToCustomerByID",
                schema: "dbo",
                table: "Invoice",
                column: "SentToCustomerByID",
                principalSchema: "dbo",
                principalTable: "SystemUser",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoice_SystemUser_SentToCustomerByID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropIndex(
                name: "IX_Invoice_SentToCustomerByID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "SentToCustomerByID",
                schema: "dbo",
                table: "Invoice");
        }
    }
}
