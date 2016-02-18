using System;
using Funq;
using ServiceStack;
using ServiceStack.Admin;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace TestWebHost
{
    public class AppHost : AppHostBase
    {
        public AppHost()
            : base("WebHost Admin UI", typeof(AutoQueryServices).Assembly) {}

        public override void Configure(Container container)
        {
            container.Register<IDbConnectionFactory>(c =>
                new OrmLiteConnectionFactory("~/App_Data/db.sqlite".MapHostAbsolutePath(), SqliteDialect.Provider));

            Plugins.Add(new AutoQueryFeature {
                MaxLimit = 100
            });

            Plugins.Add(new AdminFeature());
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