using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class vw_InvoiceInfo_Create : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS [dbo].[vw_InvoiceInfoes]; 
GO 
CREATE VIEW [dbo].[vw_InvoiceInfoes] AS
    SELECT CustomerID, Person.PersonName CustomerName, Person.Mobile CustomerMobile, Person.Phone CustomerPhone,
        Person.CallerName, Description, InvoiceDate, InvoiceNetPrice, InvoiceTotalPrice, Invoice.ID, Invoice.InvoiceNumber, 
		Invoice.TaxAmount,	Invoice.GuaranteeTime, Invoice.GuaranteeType, Invoice.SentToCustomerDate, Invoice.ProductSerials,
        Invoice.CreationDate, CreateByID, SystemUser.UserFullName CreateByName
FROM Invoice INNER JOIN 
     SystemUser ON Invoice.CreateByID = SystemUser.ID  LEFT JOIN Person ON Person.ID = Invoice.CustomerID 
WHERE Invoice.IsDeleted != 1 
GO
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DROP VIEW IF EXISTS dbo.vw_InvoiceInfo");
        }
    }
}
