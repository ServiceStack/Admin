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
            appHost.CatchAllHandlers.Add((httpMethod, pathInfo, filePath) => pathInfo.StartsWith("/ss_admin") 
                ? new StaticFileHandler(appHost.VirtualFileSources.GetFile(pathInfo)
                    ?? appHost.VirtualFileSources.GetFile("ss_admin/index.html"))
                : null);

            appHost.GetPlugin<MetadataFeature>()
                .AddPluginLink("/ss_admin/autoquery/", "AutoQuery Browser");
        }
    }
}
