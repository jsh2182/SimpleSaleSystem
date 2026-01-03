using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class PersonRelationToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CustomerID",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_CustomerID",
                schema: "dbo",
                table: "Invoice",
                column: "CustomerID");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoice_Person_CustomerID",
                schema: "dbo",
                table: "Invoice",
                column: "CustomerID",
                principalSchema: "dbo",
                principalTable: "Person",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoice_Person_CustomerID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropIndex(
                name: "IX_Invoice_CustomerID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.AlterColumn<long>(
                name: "CustomerID",
                schema: "dbo",
                table: "Invoice",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
