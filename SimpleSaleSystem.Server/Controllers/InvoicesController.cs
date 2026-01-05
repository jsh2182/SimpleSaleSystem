using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Data;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;
using SimpleSaleSystem.Server.Migrations;
using System.Security.Principal;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController(
        IMapper mapper,
        IRepository<Person> personRepo,
        IRepository<Invoice> invoiceRepo,
        IRepository<Vw_InvoiceInfo> invoiceInfoRepo) : ControllerBase
    {
        private readonly IMapper _mapper = mapper;
        private readonly IRepository<Person> _personRepo = personRepo;
        private readonly IRepository<Invoice> _invoiceRepo = invoiceRepo;
        private readonly IRepository<Vw_InvoiceInfo> _invoiceInfoRepo = invoiceInfoRepo;


        [HttpPost("[action]")]
        public async Task<ActionResult> Create(InvoiceDto model, CancellationToken cancellationToken)
        {

            if (model.InvoiceDetails?.Any() != true)
            {
                return BadRequest(new { Error = "ردیفی برای این فاکتور ثبت نشده است." });
            }
            if (model.InvoiceDetails.Any(p => p.ProductID < 1))
            {
                return BadRequest(new { Error = "کالای دست کم یکی از ردیف ها معتبر نیست." });
            }
            if (model.InvoiceDetails.Any(p => p.ProductCount < 1))
            {
                return BadRequest(new { Error = "تعداد در دست کم یکی از ردیفها کمتر از یک است." });
            }

            IIdentity? identity = Request.HttpContext.User.Identity;
            int userID = identity?.GetUserId<int>() ?? 0;
            Invoice invoice = _mapper.Map<Invoice>(model);
            if (invoice.InvoiceDetails != null)
            {
                foreach (InvoiceDetails dtl in invoice.InvoiceDetails)
                {
                    if (dtl.StorageID == 0)
                    {
                        dtl.StorageID = null;
                    }
                    if (dtl.ParentDetailID == 0)
                    {
                        dtl.ParentDetailID = null;
                    }
                }
            }
            invoice.InvoiceDate = invoice.InvoiceDate.Date.ToUniversalTime();
            if (invoice.InvoiceDate.Date > DateTime.UtcNow.Date)
            {
                return BadRequest("تاریخ فاکتور معتبر نیست.");
            }
            invoice.CreateByID = userID;
            invoice.CreationDate = DateTime.UtcNow;
            {
                invoice.InvoiceTotalPrice = model.InvoiceDetails.Sum(d => d.TotalPrice);
                invoice.TaxAmount = (invoice.InvoiceTotalPrice - invoice.DiscountAmount) * invoice.TaxPercent / 100;
                invoice.InvoiceNetPrice = model.InvoiceDetails.Sum(d => d.NetPrice) - invoice.DiscountAmount + invoice.TaxAmount;
                //invoice.TaxAmount = model.InvoiceDetails.Sum(d => d.Tax);
                //invoice.DiscountAmount = model.InvoiceDetails.Sum(d => d.Discount);
            }
            long number = await _invoiceRepo.TableNoTracking.Select(i => i.InvoiceNumber).DefaultIfEmpty().MaxAsync(i => i, cancellationToken).ConfigureAwait(false);
            invoice.InvoiceNumber = number + 1;


            await _invoiceRepo.AddAsync(invoice, cancellationToken);
            model.ID = invoice.ID;

            //var inv = await _invoiceRepo.TableNoTracking.Include(i => i.InvoiceDetails)
            //                                            .ThenInclude(d => d.Product)
            //                                            .FirstOrDefaultAsync(i => i.ID == invoice.ID, cancellationToken)
            //                                            .ConfigureAwait(false);
            //model.InvoiceDetails = inv?.InvoiceDetails?.Select(d => new InvoiceDetailsDto()
            //{
            //    CountingUnit = d.CountingUnit,
            //    Discount = d.Discount,
            //    DiscountPercent = d.DiscountPercent,
            //    ID = d.ID,
            //    InvoiceID = invoice.ID,
            //    ItemDescription = d.ItemDescription,
            //    ParentDetailID = d.ParentDetailID,
            //    ProductCount = d.ProductCount,
            //    ProductID = d.ProductID,
            //    ProductName = d.Product?.ProductName,
            //    ProductModel = d.Product?.ProductModel,
            //    ProductCode = d.Product?.ProductCode??0,
            //    ProductSerial = d.ProductSerial,
            //    PurchasePrice = d.PurchasePrice,
            //    RowIndex = d.RowIndex,
            //    StorageID = d.StorageID,
            //    Tax = d.Tax,
            //    TaxPercent = d.TaxPercent,
            //    UnitPrice = d.UnitPrice
            //}) ?? [];


            return Ok(new { ID = invoice.ID });
        }

        [HttpDelete("[action]")]
        public async Task<ActionResult> Delete(long id, CancellationToken cancellationToken, bool logicalDelete = true)
        {
            if (id < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            Invoice? invoice = await _invoiceRepo.Table.FirstOrDefaultAsync(i => i.ID == id).ConfigureAwait(false);
            if (invoice == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            if(invoice.SentToCustomerDate > DateTime.MinValue)
            {
                return BadRequest("این فاکتور قبلا برای مشتری ارسال شده و امکان حذف آن وجود ندارد.");
            }
            InvoiceDto model = new();
            _mapper.Map(invoice, model);

            if (logicalDelete)
            {
                invoice.IsDeleted = true;
                await _invoiceRepo.UpdateAsync(invoice, cancellationToken);
            }
            else
            {
                await _invoiceRepo.DeleteAsync(invoice, cancellationToken);
            }
            return Ok("Success");
        }


        [HttpPost("[action]")]
        public async Task<ActionResult> GetAll(InvoiceSearchDto model, CancellationToken cancellationToken)
        {
            IIdentity? identity = Request.HttpContext.User.Identity;
            int userID = identity?.GetUserId<int>()??0;
            IQueryable<Vw_InvoiceInfo> qry = _invoiceInfoRepo.TableNoTracking;
            qry = FilterExpressionExtension<Vw_InvoiceInfo>.Filter(qry, model);
            int totalCount = 0;
            if (model.Take > 0)
            {
                totalCount = qry.Count();
                qry = qry.Skip(model.Skip * model.Take).Take(model.Take);
            }
            InvoiceDto[] result = await qry
                .Select(inv => new InvoiceDto()
                {
                    CustomerID = inv.CustomerID,
                    CustomerName = inv.CustomerName,
                    CustomerMobile = inv.CustomerMobile,
                    Description = inv.Description,
                    InvoiceDate = inv.InvoiceDate,
                    InvoiceNetPrice = inv.InvoiceNetPrice,
                    InvoiceTotalPrice = inv.InvoiceTotalPrice,
                    ID = inv.ID,
                    InvoiceNumber = inv.InvoiceNumber,
                    TaxAmount = inv.TaxAmount,
                    GuaranteeTime = inv.GuaranteeTime,
                    SentToCustomerDate = inv.SentToCustomerDate,
                    ProductSerials = inv.ProductSerials,
                    CallerName = inv.CallerName
                })
                .ToArrayAsync(cancellationToken); 
            return Ok(new { List = result, TotalCount = totalCount });
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> Get(long id, CancellationToken cancellationToken)
        {
            Invoice? invoice = await _invoiceRepo.TableNoTracking
                .Include(I=>I.CreatingUser)
                .Include(I=>I.UpdatingUser)
                .Include(i => i.SentToCustomerUser)
                .Include(i=>i.InvoiceDetails)
                .ThenInclude(d=>d.Product)
                .FirstOrDefaultAsync(i => i.ID == id, cancellationToken).ConfigureAwait(false);
            if (invoice == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }

            InvoiceDto result = new();
            _mapper.Map(invoice, result);
            result.CreateByName = invoice.CreatingUser?.UserFullName??"";
            result.UpdateByName = invoice.UpdatingUser?.UserFullName??"";
            result.SentToCustomerByName = invoice.SentToCustomerUser?.UserFullName ?? "";
            //var inv = await _invoiceRepo.TableNoTracking.Include(i => i.InvoiceDetails)
            //                                            .ThenInclude(d => d.Product)

            //                                            .Where(i => i.ID == invoice.ID)
            //                                            .FirstOrDefaultAsync(cancellationToken)
            //                                            .ConfigureAwait(false);
            result.InvoiceDetails = invoice?.InvoiceDetails?.Select(d => new InvoiceDetailsDto()
            {
                CountingUnit = d.CountingUnit,
                Discount = d.Discount,
                DiscountPercent = d.DiscountPercent,
                ID = d.ID,
                InvoiceID = invoice.ID,
                ItemDescription = d.ItemDescription,
                ParentDetailID = d.ParentDetailID,
                ProductCount = d.ProductCount,
                ProductID = d.ProductID,
                ProductName = d.Product?.ProductName,
                ProductModel = d.Product?.ProductModel,
                ProductCode = d.Product?.ProductCode??0,
                ProductSerial = d.ProductSerial,
                PurchasePrice = d.PurchasePrice,
                RowIndex = d.RowIndex,
                StorageID = d.StorageID,
                Tax = d.Tax,
                TaxPercent = d.TaxPercent,
                UnitPrice = d.UnitPrice,
            }) ?? [];

            if (invoice.CustomerID.HasValue)
            {
                var personInfo = await _personRepo.TableNoTracking.Where(p => p.ID == invoice.CustomerID).Select(p => new { p.PersonName, p.Mobile, p.PersonAddress }).FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false);
                if (personInfo != null)
                {
                    result.CustomerName = personInfo.PersonName;
                    result.CustomerMobile = personInfo.Mobile;
                    result.CustomerAddress = personInfo.PersonAddress;
                }
            }
            return Ok(result);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult> Update(InvoiceDto model, CancellationToken cancellationToken)
        {
            if (model.ID < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            if (model.InvoiceDetails?.Any() != true)
            {
                return BadRequest("ردیفی برای این فاکتور ثبت نشده است.");
            }
            if (model.InvoiceDetails.Any(p => p.ProductID < 1))
            {
                return BadRequest("کالای دست کم یکی از ردیف ها معتبر نیست.");
            }
            if (model.InvoiceDetails.Any(p => p.ProductCount < 1))
            {
                return BadRequest("تعداد در دست کم یکی از ردیفها کمتر از یک است.");
            }

            IIdentity? identity = Request.HttpContext.User.Identity;
            int userID = identity?.GetUserId<int>() ?? 0;
            Invoice? invoice = null;

            invoice = await _invoiceRepo.Table.Include(i => i.InvoiceDetails).FirstOrDefaultAsync(i => i.ID == model.ID, cancellationToken).ConfigureAwait(false);

            if (invoice == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            if (invoice.SentToCustomerDate > DateTime.MinValue)
            {
                return BadRequest("این فاکتور قبلا برای مشتری ارسال شده و امکان ویرایش آن وجود ندارد.");
            }
            _mapper.Map(model, invoice);
            invoice.UpdatingDate = DateTime.UtcNow;
            invoice.UpdateByID = userID;
            if (invoice.InvoiceDetails != null)
            {
                foreach (InvoiceDetails dtl in invoice.InvoiceDetails)
                {
                    if (dtl.StorageID == 0)
                    {
                        dtl.StorageID = null;
                    }
                    if (dtl.ParentDetailID == 0)
                    {
                        dtl.ParentDetailID = null;
                    }
                }
            }
            foreach (var dtl in model.InvoiceDetails)
            {
                if (dtl.SignedForDelete && dtl.ID > 0)
                {
                    var found = invoice.InvoiceDetails?.FirstOrDefault(d => d.ID == dtl.ID);
                    if (found == null)
                    {
                        return BadRequest($"ردیف فاکتور با شناسه {dtl.ID} یافت نشد.");
                    }
                    invoice.InvoiceDetails?.Remove(found);
                }
            }
            if (invoice.InvoiceDetails != null)
            {
                invoice.InvoiceTotalPrice = model.InvoiceDetails.Sum(d => d.TotalPrice);
                invoice.TaxAmount = (invoice.InvoiceTotalPrice - invoice.DiscountAmount) * invoice.TaxPercent / 100;
                invoice.InvoiceNetPrice = model.InvoiceDetails.Sum(d => d.NetPrice) - invoice.DiscountAmount + invoice.TaxAmount;
            }


            await _invoiceRepo.UpdateAsync(invoice, cancellationToken);
            model.ID = invoice.ID;
            {
                var details = await _invoiceRepo.TableNoTracking.Include(i => i.InvoiceDetails).ThenInclude(d => d.Product).FirstOrDefaultAsync(i => i.ID == invoice.ID, cancellationToken).ConfigureAwait(false);
                model.InvoiceDetails = invoice?.InvoiceDetails?.Select(d => new InvoiceDetailsDto()
                {
                    CountingUnit = d.CountingUnit,
                    Discount = d.Discount,
                    DiscountPercent = d.DiscountPercent,
                    ID = d.ID,
                    InvoiceID = invoice.ID,
                    ItemDescription = d.ItemDescription,
                    ParentDetailID = d.ParentDetailID,
                    ProductCount = d.ProductCount,
                    ProductID = d.ProductID,
                    ProductName = d.Product?.ProductName,
                    ProductModel = d.Product?.ProductModel,
                    ProductCode = d.Product?.ProductCode??0,
                    ProductSerial = d.ProductSerial,
                    PurchasePrice = d.PurchasePrice,
                    RowIndex = d.RowIndex,
                    StorageID = d.StorageID,
                    Tax = d.Tax,
                    TaxPercent = d.TaxPercent,
                    UnitPrice = d.UnitPrice
                }) ?? [];
            }
            return Ok(new { Data = model });
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GetNextNumber(CancellationToken cancellationToken)
        {
            long number = await _invoiceRepo.TableNoTracking.Select(i => i.InvoiceNumber).DefaultIfEmpty().MaxAsync(i => i, cancellationToken).ConfigureAwait(false);
            return Ok(new { Data = number + 1 });
        }
        [HttpGet("[action]")]
        public async Task<ActionResult> SendToCustomer(long id, CancellationToken cancellationToken)
        {
            if(id < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
                
            }
            var invoice =await  _invoiceRepo.GetByIDAsync(cancellationToken, id);
            if(invoice == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد");
            }
            if(invoice.SentToCustomerDate > DateTime.MinValue)
            {
                return BadRequest("این فاکتور پیش از این برای مشتری ارسال شده است.");
            }
            var identity = Request.HttpContext.User.Identity;
            int userId =identity.GetUserId<int>();
            invoice.SentToCustomerDate = DateTime.UtcNow;
            invoice.SentToCustomerByID = userId;
           await _invoiceRepo.UpdateAsync(invoice, cancellationToken).ConfigureAwait(false);
            var sentDate = invoice.SentToCustomerDate.Value.ToLocalTime();

            return Ok(sentDate.ToPersian()+"."+ sentDate.ToString("HH:mm"));
        }
    }
}
