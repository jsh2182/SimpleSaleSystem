using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleSaleSystem.Server.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "Attachments",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentID = table.Column<long>(type: "bigint", nullable: false),
                    ParentType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AttachedFileName = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    AttacheDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MoreInfo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FileType = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    ImageThumbnail = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionLog",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MachineName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Logged = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Logger = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Exception = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HttpAction = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    CallSite = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RequestedURL = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionLog", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "PageList",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentPageID = table.Column<short>(type: "smallint", nullable: true),
                    PageName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PersianName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsReport = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageList", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PageList_PageList_ParentPageID",
                        column: x => x.ParentPageID,
                        principalSchema: "dbo",
                        principalTable: "PageList",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "Product",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCode = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ProductModel = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    BarCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DefaultSalePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SystemUser",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserFullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserMobile = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LoginInfo = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    OrganizationRoleID = table.Column<long>(type: "bigint", nullable: true),
                    LastLoginDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemUser", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Invoice",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<long>(type: "bigint", nullable: true),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    InvoiceNumber = table.Column<long>(type: "bigint", nullable: false),
                    ManualInvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxFee = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreateByID = table.Column<int>(type: "int", nullable: false),
                    InvoiceType = table.Column<int>(type: "int", nullable: false),
                    DestinationStorageID = table.Column<int>(type: "int", nullable: true),
                    TargetAccountID = table.Column<long>(type: "bigint", nullable: true),
                    PaymentChequeFunctionID = table.Column<long>(type: "bigint", nullable: true),
                    InvoiceState = table.Column<int>(type: "int", nullable: false),
                    ParentInvoiceID = table.Column<long>(type: "bigint", nullable: true),
                    ManualDocDesc = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PaymentMethod = table.Column<int>(type: "int", nullable: true),
                    ReturnedChqBed = table.Column<decimal>(type: "decimal(20,2)", precision: 20, scale: 2, nullable: false),
                    TargetAccountCat = table.Column<int>(type: "int", nullable: true),
                    PaidAmount = table.Column<decimal>(type: "decimal(20,2)", precision: 20, scale: 2, nullable: false),
                    IsFormal = table.Column<bool>(type: "bit", nullable: false),
                    TaxID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxInquiryID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxInquiryStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxOfficeRefNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InvoiceTotalPrice = table.Column<decimal>(type: "decimal(20,2)", precision: 20, scale: 2, nullable: false),
                    InvoiceNetPrice = table.Column<decimal>(type: "decimal(20,2)", precision: 20, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoice", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Invoice_Invoice_ParentInvoiceID",
                        column: x => x.ParentInvoiceID,
                        principalSchema: "dbo",
                        principalTable: "Invoice",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Invoice_SystemUser_CreateByID",
                        column: x => x.CreateByID,
                        principalSchema: "dbo",
                        principalTable: "SystemUser",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PagePermission",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PageID = table.Column<short>(type: "smallint", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    CanRead = table.Column<bool>(type: "bit", nullable: false),
                    CanInsert = table.Column<bool>(type: "bit", nullable: false),
                    CanUpdate = table.Column<bool>(type: "bit", nullable: false),
                    CanDelete = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PagePermission", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PagePermission_PageList_PageID",
                        column: x => x.PageID,
                        principalSchema: "dbo",
                        principalTable: "PageList",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PagePermission_SystemUser_UserID",
                        column: x => x.UserID,
                        principalSchema: "dbo",
                        principalTable: "SystemUser",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentPersonID = table.Column<int>(type: "int", nullable: true),
                    PersonName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PersonCode = table.Column<int>(type: "int", nullable: false),
                    LegalPersonality = table.Column<bool>(type: "bit", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    PassportCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CommercialCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    RegisterationNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SubscriptionCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Mobile = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PersonAddress = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RespectTitle = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsBlackListed = table.Column<bool>(type: "bit", nullable: false),
                    AccountingType = table.Column<bool>(type: "bit", nullable: true),
                    BranchCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatingUserID = table.Column<int>(type: "int", nullable: false),
                    IsStaff = table.Column<bool>(type: "bit", nullable: false),
                    IsAgency = table.Column<bool>(type: "bit", nullable: false),
                    IsCustomer = table.Column<bool>(type: "bit", nullable: false),
                    IsPreCustomer = table.Column<bool>(type: "bit", nullable: false),
                    IsPersonnel = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Person_Person_ParentPersonID",
                        column: x => x.ParentPersonID,
                        principalSchema: "dbo",
                        principalTable: "Person",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Person_SystemUser_CreatingUserID",
                        column: x => x.CreatingUserID,
                        principalSchema: "dbo",
                        principalTable: "SystemUser",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceDetails",
                schema: "dbo",
                columns: table => new
                {
                    ID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceID = table.Column<long>(type: "bigint", nullable: false),
                    RowIndex = table.Column<int>(type: "int", nullable: false),
                    StorageID = table.Column<int>(type: "int", nullable: true),
                    ProductID = table.Column<long>(type: "bigint", nullable: false),
                    ProductSerial = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ProductCount = table.Column<decimal>(type: "decimal(10,4)", precision: 10, scale: 4, nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PureTotalPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    CountingUnit = table.Column<int>(type: "int", nullable: true),
                    ItemDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Discount = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    Tax = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    TaxPercent = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(8,6)", precision: 8, scale: 6, nullable: false),
                    ParentDetailID = table.Column<long>(type: "bigint", nullable: true),
                    PurchasePrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDetails", x => x.ID);
                    table.ForeignKey(
                        name: "FK_InvoiceDetails_Invoice_InvoiceID",
                        column: x => x.InvoiceID,
                        principalSchema: "dbo",
                        principalTable: "Invoice",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceDetails_Product_ProductID",
                        column: x => x.ProductID,
                        principalSchema: "dbo",
                        principalTable: "Product",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_CreateByID",
                schema: "dbo",
                table: "Invoice",
                column: "CreateByID");

            migrationBuilder.CreateIndex(
                name: "IX_Invoice_ParentInvoiceID",
                schema: "dbo",
                table: "Invoice",
                column: "ParentInvoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceDetails_InvoiceID",
                schema: "dbo",
                table: "InvoiceDetails",
                column: "InvoiceID");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceDetails_ProductID",
                schema: "dbo",
                table: "InvoiceDetails",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_PageList_ParentPageID",
                schema: "dbo",
                table: "PageList",
                column: "ParentPageID");

            migrationBuilder.CreateIndex(
                name: "IX_PagePermission_PageID",
                schema: "dbo",
                table: "PagePermission",
                column: "PageID");

            migrationBuilder.CreateIndex(
                name: "IX_PagePermission_UserID",
                schema: "dbo",
                table: "PagePermission",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Person_CreatingUserID",
                schema: "dbo",
                table: "Person",
                column: "CreatingUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Person_Deleted_BlackListed",
                schema: "dbo",
                table: "Person",
                columns: new[] { "IsDeleted", "IsBlackListed" })
                .Annotation("SqlServer:Include", new[] { "ID", "PersonName", "Phone", "PersonCode", "NationalCode", "Mobile" });

            migrationBuilder.CreateIndex(
                name: "IX_Person_Name",
                schema: "dbo",
                table: "Person",
                column: "PersonName")
                .Annotation("SqlServer:Include", new[] { "IsDeleted", "IsBlackListed", "Phone", "PersonCode", "NationalCode", "Mobile" });

            migrationBuilder.CreateIndex(
                name: "IX_Person_ParentPersonID",
                schema: "dbo",
                table: "Person",
                column: "ParentPersonID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "ExceptionLog",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "InvoiceDetails",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "PagePermission",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Person",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Invoice",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Product",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "PageList",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "SystemUser",
                schema: "dbo");
        }
    }
}
