using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using Funq;
using ServiceStack;
using ServiceStack.Admin;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace TestVirtualWebHost
{
    public class AppHost : AppHostBase
    {
        public AppHost()
            : base("Virtual WebHost Admin UI", typeof(AutoQueryServices).Assembly) { }

        public override void Configure(Container container)
        {
            container.Register<IDbConnectionFactory>(c =>
                new OrmLiteConnectionFactory("~/App_Data/db.sqlite".MapHostAbsolutePath(), SqliteDialect.Provider));

            Plugins.Add(new AutoQueryFeature
            {
                MaxLimit = 100
            });

            Plugins.Add(new AdminFeature {
                InsertHtml = $"<script>document.title='My App'</script>"
            });

            SetConfig(new HostConfig {
                HandlerFactoryPath = "api",
                // WebHostUrl = "http://localhost/TestVirtual.WebHost/api",
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