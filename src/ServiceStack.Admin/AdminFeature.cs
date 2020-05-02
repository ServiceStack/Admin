#if NETSTANDARD2_0        
using ServiceStack.Host;
#else
using System.Web;
#endif
using ServiceStack.Host.Handlers;

namespace ServiceStack.Admin
{
    public class AdminFeature : IPlugin, IPreInitPlugin
    {
        public void BeforePluginsLoaded(IAppHost appHost)
        {
            appHost.Config.EmbeddedResourceBaseTypes.Add(typeof(AdminFeature));
        }

        public void Register(IAppHost appHost)
        {
            var indexFile = appHost.VirtualFileSources.GetFile("ss_admin/index.html");
            if (indexFile == null)
                return; // not accessible when referenced as a source project 
            
            var indexHtml = indexFile.ReadAllText();

            appHost.CatchAllHandlers.Add((httpMethod, pathInfo, filePath) => 
                pathInfo.StartsWith("/ss_admin") 
                    ? (pathInfo == "/ss_admin/index.html" || !appHost.VirtualFileSources.FileExists(pathInfo)
                        ? new CustomActionHandlerAsync(async (req, res) => {
                            res.ContentType = MimeTypes.Html;
                            await res.WriteAsync(indexHtml.Replace("/dist", req.ResolveAbsoluteUrl("~/ss_admin/dist")));
                        }) as IHttpHandler
                        : new StaticFileHandler(appHost.VirtualFileSources.GetFile(pathInfo)))
                    : null);

            appHost.GetPlugin<MetadataFeature>()
                .AddPluginLink("ss_admin/autoquery/", "AutoQuery Viewer");
        }
    }
}
