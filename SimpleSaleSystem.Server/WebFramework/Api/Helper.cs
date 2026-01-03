using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimpleSaleSystem.WebFramework.Api
{
    public static class Helper
    {
        public static async Task<byte[]?> ToBytesAsync(this IFormFile? file, CancellationToken cancellation)
        {
            if (file == null || file.Length == 0)
                return null;

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, cancellation).ConfigureAwait(false);
            return ms.ToArray();
        }
    }
}
