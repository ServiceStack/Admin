using System;
using System.Collections.Generic;
using System.Diagnostics;
using Funq;
using ServiceStack;
using ServiceStack.Admin;
using ServiceStack.Data;
using ServiceStack.IO;
using ServiceStack.OrmLite;
using ServiceStack.Text;
using ServiceStack.Web;

namespace TestSelfHost
{
    class Program
    {
        static void Main(string[] args)
        {
            new AppHost().Init()
                .Start("http://*:8000/");

            Process.Start("http://localhost:8000/ss_admin/");

            "Listening on http://localhost:8000/ ...".Print();
            Console.ReadLine();
        }
    }

    public class AppHost : AppSelfHostBase
    {
        public AppHost()
            : base("SelfHost Admin UI", typeof(AutoQueryServices).Assembly) { }

        public override void Configure(Container container)
        {
            container.Register<IDbConnectionFactory>(c =>
                new OrmLiteConnectionFactory(MapProjectPath("~/db.sqlite"), SqliteDialect.Provider));

            Plugins.Add(new AutoQueryFeature {
                MaxLimit = 100
            });

            Plugins.Add(new AdminFeature {
                InsertHtml = $"<script>document.title='My App'</script>"
            });
        }
    }

    public class AutoQueryServices : Service
    {        
    }

}
