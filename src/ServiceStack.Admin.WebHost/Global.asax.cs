using System;
using System.Collections.Generic;
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

            Plugins.Add(new AutoQueryFeature { MaxLimit = 100 });

            Plugins.Add(new AutoQueryDataFeature { MaxLimit = 100 });
        }
    }


    [FallbackRoute("/{PathInfo*}")]
    public class FallbackForClientRoutes
    {
        public string PathInfo { get; set; }
    }

    public class AutoQueryServices : Service
    {
        public object Any(FallbackForClientRoutes request)
        {
            return new HttpResult(VirtualFileSources.GetFile("index.html"));
        }
    }


    [Route("/query/requestlogs")]
    [Route("/query/requestlogs/{Date}")]
    public class QueryRequestLogs : QueryData<RequestLogEntry>
    {
        public DateTime? Date { get; set; }
        public bool ViewErrors { get; set; }
    }

    public class AutoQueryDataServices : Service
    {
        public IAutoQueryData AutoQuery { get; set; }

        public object Any(QueryRequestLogs query)
        {
            var date = query.Date.GetValueOrDefault(new DateTime(2016,4,13));
            var logSuffix = query.ViewErrors ? "-errors" : "";
            var csvLogsFile = VirtualFileSources.GetFile("requestlogs/{0}-{1}/{0}-{1}-{2}{3}.csv".Fmt(
                date.Year.ToString("0000"),
                date.Month.ToString("00"),
                date.Day.ToString("00"),
                logSuffix));

            if (csvLogsFile == null)
                throw HttpError.NotFound("No logs found on " + date.ToShortDateString());

            var logs = csvLogsFile.ReadAllText().FromCsv<List<RequestLogEntry>>();

            var q = AutoQuery.CreateQuery(query, Request,
                db: new MemoryDataSource<RequestLogEntry>(logs, query, Request));

            return AutoQuery.Execute(query, q);
        }
    }


    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            new AppHost().Init();
        }
    }
}