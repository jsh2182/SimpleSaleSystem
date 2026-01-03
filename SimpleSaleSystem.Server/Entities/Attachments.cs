using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimpleSaleSystem.Entities
{
    public class Attachments:BaseEntity<long>
    {
        public long ParentID { get; set; }
        public required string ParentType { get; set; }
        public required string AttachedFileName { get; set; }
        public DateTime AttacheDate { get; set; }
        public string?  MoreInfo { get; set; }
        public string? FileType { get; set; }
        public byte[]? ImageThumbnail { get; set; }
    }
}
