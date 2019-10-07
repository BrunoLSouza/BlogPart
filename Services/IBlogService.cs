using BrunoLemesBlog.Models;
using System.Collections.Generic;

namespace BrunoLemesBlog.Services
{
    public interface IBlogService
    {
        string GetPostText(string link);
        List<BlogPost> GetLatestPosts();
        List<BlogPost> GetOlderPosts(int oldestPostId);
    }
}