using ServiceStack;

namespace Admin.Tasks
{
    public class Config
    {
        public static string ConnectionString = "~/../../../src/ServiceStack.Admin.WebHost/App_Data/db.sqlite".MapHostAbsolutePath();
    }
}