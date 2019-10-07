using BrunoLemesBlog.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrunoLemesBlog.Models
{
    public class BlogPost
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string Link
        {
            get
            {
                return ShortDescription.URLFriendly(50);
            }
        }
    }
}
