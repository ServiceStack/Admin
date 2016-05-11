using System.Web;
using ServiceStack.Host.Handlers;

namespace ServiceStack.Admin
{
    public class AdminFeature : IPlugin, IPreInitPlugin
    {
        public void Configure(IAppHost appHost)
        {
            appHost.Config.EmbeddedResourceBaseTypes.Add(typeof(AdminFeature));
        }

        public void Register(IAppHost appHost)
        {
            var indexHtml = appHost.VirtualFileSources.GetFile("ss_admin/index.html").ReadAllText();
            if (appHost.Config.WebHostUrl != null)
                indexHtml = indexHtml.Replace("/ss_admin", appHost.Config.WebHostUrl.CombineWith("ss_admin"));
            else if (appHost.Config.HandlerFactoryPath != null)
                indexHtml = indexHtml.Replace("/ss_admin", "/{0}/ss_admin".Fmt(appHost.Config.HandlerFactoryPath));

            appHost.CatchAllHandlers.Add((httpMethod, pathInfo, filePath) => 
                pathInfo.StartsWith("/ss_admin") 
                    ? (pathInfo == "/ss_admin/index.html" || !appHost.VirtualFileSources.FileExists(pathInfo)
                        ? new StaticContentHandler(indexHtml, MimeTypes.Html) as IHttpHandler
                        : new StaticFileHandler(appHost.VirtualFileSources.GetFile(pathInfo)))
                    : null);

            appHost.GetPlugin<MetadataFeature>()
                .AddPluginLink("ss_admin/autoquery/", "AutoQuery Viewer");
        }
    }
}
