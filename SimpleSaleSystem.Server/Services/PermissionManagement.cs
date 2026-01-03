using SimpleSaleSystem.Data;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Entities;
using SimpleSaleSystem.Entities.DtoModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text;

namespace SimpleSaleSystem.Services
{
    public static class PermissionManagement
    {
        public static async Task<bool> HasPagePermission(int userID, short pageID, IPagePermissionRepository pagePermissionRepo, PermissionActionType actionType, CancellationToken cancellationToken)
        {

            if (pageID > 0)
            {
                Expression<Func<PagePermission, bool>> leftEx = p => true;
                switch (actionType)
                {
                    case PermissionActionType.Read:
                        leftEx = p => p.CanRead;
                        break;
                    case PermissionActionType.Insert:
                        leftEx = p => p.CanInsert;
                        break;
                    case PermissionActionType.Update:
                        leftEx = p => p.CanUpdate;
                        break;
                    case PermissionActionType.Delete:
                        leftEx = p => p.CanDelete;
                        break;
                    default:
                        break;
                }
                Expression<Func<PagePermission, bool>> rightEx = p => p.UserID == userID && p.PageID == pageID;
                var ex = leftEx.And(rightEx);
                bool result = await pagePermissionRepo.TableNoTracking.AnyAsync(ex, cancellationToken);
                return result;
            }
            return false;
        }
        public static async Task<bool> HasPagePermission(int userID, string pageName, IPagePermissionRepository pagePermissionRepo, PermissionActionType actionType, CancellationToken cancellationToken)
        {

            if (string.IsNullOrWhiteSpace(pageName))
            {
                return false;
            }
            short pageID = GlobalItems.AllPages?.FirstOrDefault(p => p.PageName == pageName)?.ID ?? 0;
            if (pageID > 0)
            {
                Expression<Func<PagePermission, bool>> leftEx = p => true;
                switch (actionType)
                {
                    case PermissionActionType.Read:
                        leftEx = p => p.CanRead;
                        break;
                    case PermissionActionType.Insert:
                        leftEx = p => p.CanInsert;
                        break;
                    case PermissionActionType.Update:
                        leftEx = p => p.CanUpdate;
                        break;
                    case PermissionActionType.Delete:
                        leftEx = p => p.CanDelete;
                        break;
                    default:
                        break;
                }
                Expression<Func<PagePermission, bool>> rightEx = p => p.UserID == userID && p.PageID == pageID;
                var ex = leftEx.And(rightEx);
                bool result = await pagePermissionRepo.TableNoTracking.AnyAsync(ex, cancellationToken);
                return result;
            }
            return false;
        }
        public static async Task<bool> GrantOrRemovePermission(List<PagePermissionDto> model, IPagePermissionRepository pagePermissionRepo, CancellationToken cancellationToken)
        {
            IEnumerable<short> pageIDs = model.Select(m => m.PageID).Distinct();
            int userID = model.First().UserID;
            List<PagePermission> existing = await pagePermissionRepo.Table.Where(p => p.UserID == userID && pageIDs.Contains(p.PageID)).ToListAsync(cancellationToken);
            foreach (PagePermission item in existing)
            {
                PagePermissionDto p = model.First(m => m.PageID == item.PageID);
                if (p.CanDelete.HasValue)
                {
                    item.CanDelete = p.CanDelete.Value;
                }
                if (p.CanRead.HasValue)
                {
                    item.CanRead = p.CanRead.Value;
                }
                if (p.CanInsert.HasValue)
                {
                    item.CanInsert = p.CanInsert.Value;
                }
                if (p.CanUpdate.HasValue)
                {
                    item.CanUpdate = p.CanUpdate.Value;
                }
            }
            var existingIDs = existing.Select(e => e.PageID);
            List<PagePermission> newOnes = model.Where(m => !existingIDs.Contains(m.PageID)).Select(pm =>
                new PagePermission()
                {
                    ID = 0,
                    CanDelete = pm.CanDelete == true,
                    CanRead = pm.CanRead == true,
                    CanInsert = pm.CanInsert == true,
                    CanUpdate = pm.CanUpdate == true,
                    PageID = pm.PageID,
                    UserID = userID
                }).ToList();

            await pagePermissionRepo.AddRangeAsync(newOnes, cancellationToken, false);
            foreach (var item in newOnes)
            {
                var n = model.First(p => p.PageID == item.PageID);
            }
            await pagePermissionRepo.UpdateRangeAsync(existing, cancellationToken, false);
            return true;
        }
        public static async Task<List<PagePermissionDto>> SelectPageNode(short parentID, int userID, List<PageList> pageList, IPagePermissionRepository pagePermissionRepo, CancellationToken cancellationToken)
        {
            var pageNodeList = pageList.Where(p => p.ParentPageID == parentID).OrderBy(p => p.PersianName).ToList();
            List<PagePermission> pagePermissions = await pagePermissionRepo.TableNoTracking.Where(p => p.UserID == userID).ToListAsync(cancellationToken).ConfigureAwait(false);
            List<PagePermissionDto> result = [];
            foreach (var page in pageNodeList)
            {
                var permission = pagePermissions.FirstOrDefault(pr => pr.UserID == userID);
                var p = new PagePermissionDto()
                {
                    PageID = page.ID,
                    PageName = page.PageName,
                    PersianName = page.PersianName,
                    IsReport = page.IsReport
                };
                if (permission != null)
                {
                    p.CanDelete = permission.CanDelete;
                    p.CanRead = permission.CanRead;
                    p.CanInsert = permission.CanInsert;
                    p.CanUpdate = permission.CanUpdate;
                }
                var subList = pageList.Where(p => p.ParentPageID == page.ID).OrderBy(p => p.PersianName);
                foreach (var item in subList)
                {
                    p.Children.Add((item.ID, item.PersianName));
                }
                result.Add(p);
            }
            return result;
        }
        public static List<string> FindPagePath(string searchingName, List<PageList> pageList)
        {
            List<string> result = [];
            var nodes = pageList.Where(p => p.ParentPageID > 0 && p.PersianName.Contains(searchingName)).ToList();
            foreach (var n in nodes)
            {
                StringBuilder path = new(n.PersianName);
                short parentCount = 1;
                long? parentID = n.ParentPageID;
                while (parentID.HasValue)
                {
                    var parent = pageList.FirstOrDefault(p => p.ID == parentID);
                    if (parent != null)
                    {
                        parentID = parent.ParentPageID;
                        if (parent.ParentPageID == null && parentCount == 1)
                        {
                            var sibling = pageList.FirstOrDefault(p => p.ParentPageID == parent.ID && p.ID != n.ID);
                            if (sibling != null && pageList.Any(p => p.ParentPageID == sibling.ID))
                            {
                                path.Insert(0, "سایر" + "\uD83E\uDC78");
                            }
                        }
                        path.Insert(0, parent.PersianName + "\uD83E\uDC78");
                    }
                    parentCount++;
                }
                result.Add(path.ToString());
            }
            return result;
        }
    }
}
