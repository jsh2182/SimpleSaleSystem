using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;

namespace SimpleSaleSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController(
        IMapper mapper,
        IRepository<Product> productRepo,
        IRepository<InvoiceDetails> invoiceDetailsRepo
         ) : ControllerBase
    {
        private readonly IMapper _mapper = mapper;
        private readonly IRepository<Product> _productRepo = productRepo;
        private readonly IRepository<InvoiceDetails> _invoiceDetailsRepo = invoiceDetailsRepo;

        [HttpGet("[action]")]
        //[Page("Product", PermissionActionType.Read)]
        public async Task<ActionResult> Get(int id, CancellationToken cancellationToken)
        {
            if (id < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            Product? product = await _productRepo.TableNoTracking.FirstOrDefaultAsync(p => p.ID == id, cancellationToken);
            if (product == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            ProductDto result = _mapper.Map<ProductDto>(product);
            return Ok(result);


        }

        [HttpPost("[action]")]
        //[Page("SearchProduct", PermissionActionType.Read)]
        public async Task<ActionResult> GetAll(ProductSearchDto model, CancellationToken cancellationToken)
        {
            var qry = _productRepo.TableNoTracking.Where(p => !p.IsDeleted);
            if (model.ProductCode > 0)
            {
                qry = qry.Where(q => q.ProductCode == model.ProductCode);
            }
            if(model.ProductName.HasValue())
            {
                qry = qry.Where(q => q.ProductName.Contains(model.ProductName)); 
            }
            if (model.ProductModel.HasValue())
            {
                qry = qry.Where(q => q.ProductModel.Contains(model.ProductModel));
            }
            if (model.BarCode.HasValue())
            {
                qry = qry.Where(q => q.BarCode.Contains(model.BarCode));
            }
            qry = qry.OrderBy(q => q.ProductName).ThenBy(q => q.ProductModel);
            int? totalCount = null;
            if (model.Take > 0)
            {
                totalCount = qry.Count();
                qry = qry.Skip(model.Skip * model.Take).Take(model.Take);
            }
                var result = await qry.Select(q => new
                {
                    q.ID,
                    q.BarCode,
                    q.ProductCode,
                    q.ProductName,
                    q.ProductModel,
                    q.DefaultSalePrice,
                    q.CountIsEditableInSelect,
                    q.PriceIsEditableInSelect
                }).ToListAsync(cancellationToken).ConfigureAwait(false);

            return Ok(new {list = result, totalCount = totalCount ?? result.Count});
        }

        [HttpPost("[action]")]
        //[Page("Product", PermissionActionType.Insert)]
        public async Task<ActionResult> Create(ProductDto model, CancellationToken cancellationToken)
        {

            model.ProductModel = model.ProductModel.FixPersianChars();
            string dupResult = await CheckProductDup(model, cancellationToken);
            if (dupResult.HasValue())
            {
                return BadRequest(dupResult);
            }
            Product result = _mapper.Map<Product>(model);
            if (!(result.ProductCode > 0))
            {
                var maxCode = await _productRepo.TableNoTracking.Select(p => p.ProductCode).DefaultIfEmpty().MaxAsync(cancellationToken);
                result.ProductCode = maxCode + 1;
            }
            await _productRepo.AddAsync(result, cancellationToken);
            model.ID = result.ID;
            return Ok(model);

        }

        [HttpPut("[action]")]
        //[Page("Product", PermissionActionType.Update)]
        public async Task<ActionResult> Update(ProductDto model, CancellationToken cancellationToken)
        {

            if (model.ID < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            model.ProductModel = model.ProductModel.FixPersianChars();
            string dupResult = await CheckProductDup(model, cancellationToken);
            if (dupResult.HasValue())
            {
                return BadRequest(dupResult);
            }

            Product? result = await _productRepo.Table.FirstOrDefaultAsync(p => !p.IsDeleted && p.ID == model.ID, cancellationToken);
            if (result == null)
            {
                return BadRequest("اطلاعات درخواستی در سیستم وجود ندارد.");
            }
            _mapper.Map(model, result);
            await _productRepo.UpdateAsync(result, cancellationToken);
            return Ok(model);

        }

        [HttpDelete("[action]")]
        //[Page("Product", PermissionActionType.Delete)]
        public async Task<ActionResult> Delete(long id, CancellationToken cancellationToken)
        {
            if (id < 1)
            {
                return BadRequest("شناسه ارسالی معتبر نیست.");
            }
            if(_invoiceDetailsRepo.TableNoTracking.Any(d=>d.ProductID == id))
            {
                return BadRequest("برای این کالا فاکتور ثبت شده است.");
            }
            int delCount = await _productRepo.TableNoTracking.Where(p => p.ID == id).ExecuteDeleteAsync(cancellationToken);
            if (delCount < 1)
            {
                return BadRequest("اشکال در انجام عملیات");
            }
            return Ok("حذف با موفقیت انجام شد.");

        }
        private async Task<string> CheckProductDup(ProductDto model, CancellationToken cancellationToken)
        {
            var existing = await _productRepo.TableNoTracking.Where(p => !p.IsDeleted && p.ID != model.ID &&
                                                             ((model.ProductCode > 0 &&p.ProductCode == model.ProductCode) ||
                                                             (p.ProductModel == model.ProductModel && p.ProductName == model.ProductName) ||

                                                             (!string.IsNullOrWhiteSpace(p.BarCode) && p.BarCode == model.BarCode)))
                .Select(p => new
                {
                    p.BarCode,
                    p.ProductCode,
                    p.ProductModel,
                    p.ProductName
                }).FirstOrDefaultAsync(cancellationToken);
            if (existing != null)
            {
                if (existing.ProductCode == model.ProductCode)
                {
                    return "کالای دیگری با این کد در سیستم وجود دارد.";
                }
                if (existing.ProductName == model.ProductName && existing.ProductModel == model.ProductModel)
                {
                    return ("کالای دیگری با این نام ومدل در سیستم وجود دارد.");
                }
                if (!string.IsNullOrWhiteSpace(existing.BarCode) && existing.BarCode == model.BarCode)
                {
                    return ("کالای دیگری با این بارکد در سیستم وجود دارد.");
                }
            }
            return "";
        }

    }
}
