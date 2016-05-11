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

            appHost.CatchAllHandlers.Add((httpMethod, pathInfo, filePath) => 
                pathInfo.StartsWith("/ss_admin") 
                    ? (pathInfo == "/ss_admin/index.html" || !appHost.VirtualFileSources.FileExists(pathInfo)
                        ? new CustomActionHandler((req, res) => {
                            res.ContentType = MimeTypes.Html;
                            res.Write(indexHtml.Replace("/ss_admin", req.ResolveAbsoluteUrl("~/ss_admin")));
                        }) as IHttpHandler
                        : new StaticFileHandler(appHost.VirtualFileSources.GetFile(pathInfo)))
                    : null);

            appHost.GetPlugin<MetadataFeature>()
                .AddPluginLink("ss_admin/autoquery/", "AutoQuery Viewer");
        }
    }
}
