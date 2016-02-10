using System;
using Funq;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace ServiceStack.Admin.WebHost
{
    public class AppHost : AppHostBase
    {
        public AppHost()
            : base("Admin UI", typeof(AutoQueryServices).Assembly) {}

        public override void Configure(Container container)
        {
            container.Register<IDbConnectionFactory>(c =>
                new OrmLiteConnectionFactory("~/App_Data/db.sqlite".MapHostAbsolutePath(), SqliteDialect.Provider));

            Plugins.Add(new AutoQueryFeature {
                MaxLimit = 100
            });
        }
    }

    public class AutoQueryServices : Service
    {
    }

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            new AppHost().Init();
        }
    }
}