using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDateToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UpdateByID",
                schema: "dbo",
                table: "Invoice",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatingDate",
                schema: "dbo",
                table: "Invoice",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_UpdateByID",
                schema: "dbo",
                table: "Invoice",
                column: "UpdateByID");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoice_SystemUser_UpdateByID",
                schema: "dbo",
                table: "Invoice",
                column: "UpdateByID",
                principalSchema: "dbo",
                principalTable: "SystemUser",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoice_SystemUser_UpdateByID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropIndex(
                name: "IX_Invoice_UpdateByID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "UpdateByID",
                schema: "dbo",
                table: "Invoice");

            migrationBuilder.DropColumn(
                name: "UpdatingDate",
                schema: "dbo",
                table: "Invoice");
        }
    }
}
