# ServiceStack.Admin has been replaced with [Admin UI](https://docs.servicestack.net/admin-ui) and [Locode](https://docs.servicestack.net/locode/)

---

Follow [@ServiceStack](https://twitter.com/servicestack) or [view the docs](https://docs.servicestack.net), use [StackOverflow](http://stackoverflow.com/questions/ask) or the [Customer Forums](https://forums.servicestack.net/) for support.

# ServiceStack.Admin UI

ServiceStack.Admin is the home for ServiceStack's new Admin UI with initial support for 
AutoQuery Viewer - an instant UI for constructing and browsing your 
[AutoQuery](https://github.com/ServiceStack/ServiceStack/wiki/Auto-Query) Services: 

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/query-default-values.png)](http://github.servicestack.net/ss_admin/autoquery)

> [YouTube Demo](https://youtu.be/YejYkCvKsuQ)

### Live AutoQuery Viewer Examples

- http://github.servicestack.net/ss_admin/
- http://northwind.netcore.io/ss_admin/
- http://stackapis.netcore.io/ss_admin/
- http://techstacks.netcore.io/ss_admin

The ServiceStack.Admin UI is a Single Page React App encapsulated in a single `ServiceStack.Admin.dll` 
that's available from NuGet at:

### Install ServiceStack.Admin

    PM> Install-Package ServiceStack.Admin

Signed Version also available from NuGet at [ServiceStack.Admin.Signed](nuget.org/packages/ServiceStack.Admin.Signed)
    
Then to add it to your project, register the Plugin:

```csharp
Plugins.Add(new AdminFeature());
```

Requires [AutoQuery](https://github.com/ServiceStack/ServiceStack/wiki/Auto-Query) to be registered:

```csharp
Plugins.Add(new AutoQueryFeature { MaxLimit = 100 });
```

Once enabled a link to the AutoQuery Viewer will appear under **Plugin Links** in your 
[Metadata Page](https://github.com/ServiceStack/ServiceStack/wiki/Metadata-page):

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/metadata-plugin-link.png)

> Or navigate to it directly at `/ss_admin/`

## AutoQuery Viewer

The AutoQuery Viewer provides an instant automatic UI to quickly browse and query all your AutoQuery Services.

By default AutoQuery Services start with a minimal UI that uses the Request DTO name to identify the Query.
An example of this can be seen with the 
[Northwind AutoQuery Services](http://northwind.netcore.io/ss_admin/autoquery/QueryCustomers) below:

```csharp
[Route("/query/customers")]
public class QueryCustomers : QueryDb<Customer> {}

[Route("/query/orders")]
public class QueryOrders : QueryDb<Order> {}
```

Which renders a UI with the default query and initial fields unpopulated:

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/unannotated-autoquery-services.png)](http://northwind.netcore.io/ss_admin/autoquery/QueryCustomers)

### Marking up AutoQuery Services

To provide a more useful experience to end users you can also markup your AutoQuery Services by annotating them
with the `[AutoQueryViewer]` attribute, as seen in 
[GitHub QueryRepos](http://github.servicestack.net/ss_admin/autoquery/QueryRepos):

```csharp
[Route("/repos")]
[AutoQueryViewer(IconUrl = "octicon:repo",    
    Title = "ServiceStack Repositories", 
    Description = "Browse different ServiceStack repos",
    DefaultSearchField = "Language", DefaultSearchType = "=", DefaultSearchText = "C#",
    DefaultFields = "Id,Name,Language,Description:500,Homepage,Has_Wiki")]
public class QueryRepos : QueryDb<GithubRepo> {}
```

The additional metadata is then used to customize the UI at the following places:

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/query-default-values-markup.png)](http://github.servicestack.net/ss_admin/autoquery/QueryRepos)

Where `Title`, `Description`, `DefaultSearchField`, `DefaultSearchType` and `DefaultSearchText` is a 
straight forward placeholder replacement.

#### IconUrl

Can either be an url to a **24x24** icon or preferably to avoid relying on any external resources, 
Admin UI embeds both
[Google's Material Design Icons](https://design.google.com/icons/) and 
[GitHub's Octicon](https://octicons.github.com/) fonts which can be referenced using the custom
`octicon:` and `material-icons:` schemes, e.g:

 - octicon:icon
 - material-icons:cast

#### DefaultFields

Can hold a subset list of fields from the AutoQuery **Response Type** in the order you want them displayed.
By default fields have a max-width of **300px** but we can override this default with a `:` suffix as seen
with `Description:500` which changes the Description column width to **500px**. Any text longer than its width
is automatically clipped, but you can see the full-text by hovering over the field or by clicking the 
AutoQuery generated link to call the AutoQuery Service and view the entire results.

> For more, see [Advanced Customizations](#advanced-customizations)

### Filter AutoQuery Services

You can use the filter textbox to quickly find and browse to AutoQuery Services:

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/filter-autoquery-services.png)

### Authorized Only Queries

Users only see Queries they have access to, this lets you further custom tailor the UI for users by using the 
`[Authenticate]`, Required Role or Permission attributes to ensure different users on see relevant queries,
e.g. 

```csharp
[RequiredRole("Sales")]
public class QueryOrders : QueryDb<Order> {}
```

Since the Auth attributes are Request Filter Attributes with a server dependency to **ServiceStack.dll**, if
you want to maintain and share a dependency-free **ServiceModel.dll** you can instead define a custom 
AutoQuery in your Service implementations which will inherit any Service or Action filter attributes as normal:

```csharp
public class QueryOrders : QueryDb<Order> {}

[RequiredRole("Sales")]
public class SalesServices : Service
{
    public IAutoQueryDb AutoQuery { get; set; }

    public object Any(QueryOrders query)
    {
        return AutoQuery.Execute(query, AutoQuery.CreateQuery(query, Request));
    }
}
```

### Updated in Real-time

To enable a productive and faster UX, the generated AutoQuery link and query results are refreshed as-you-type, 
in addition any change to a any query immediately saves the App's state to **localStorage** so users queries 
are kept across page refreshes or browser restarts.

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/search-as-type.png)

The generated AutoQuery Url is kept in-sync and captures the state of the current query and serves as a 
good source for constructing AutoQuery requests that can be used as-is in client applications. 

### Multiple Conditions

Queries can be constructed with multiple conditions by hitting **Enter** or clicking on the **green (+)** button 
(activated when a condition is valid), adding it to the conditions list and clearing the search text:  

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/multiple-conditions.png)

Clicking the **red** remove icon removes the condition.

### Saving Queries

After adding multiple conditions you can then save queries under each AutoQuery Service by clicking the **save icon**. 

The saved query will be listed with the name provided and displayed to the right of the save icon, e.g:

[![](http://i.imgur.com/hySw1T9.png)](https://github.com/ServiceStack/Admin)

This makes it easy for everyone to maintain and easily switch between multiple personalized views 
of any AutoQuery Service.

### Change Content-Type

You can force a query to return a specific Content-Type response by clicking on one of the format links. E.g
clicking on **json** link will add the **.json** extension to the generated url, overriding the browser's
default Content-Type to return a JSON response: 

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/custom-content-types.png)

### Customize Columns

Results can further customized to show only the columns you're interested in by clicking on the 
**show/hide columns** icon and selecting the columns you want to see in the order you want them added:

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/customize-columns.png)

### Sorting Columns and Paging Results

Results can be sorted in descending or ascending order by clicking on the column headers:

![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/paging-queries.png)

Clicking the back/forward navigation icons on the left will page through the results in the order specified.

## Advanced Customizations

Most of the AutoQuery Viewer UI is metadata driven and can be overridden when registering the `AutoQueryMetadataFeature`
plugin. The configuration below shows the defaults:

```csharp
//Needs to be registered before AutoQueryFeature Plugin
Plugins.Add(new AutoQueryMetadataFeature 
{
    AutoQueryViewerConfig = new AutoQueryViewerConfig
    {
        Formats = new[] { "json", "xml", "csv" },
        ImplicitConventions = new List<AutoQueryConvention>
        {
            new AutoQueryConvention { Name = "=", Value = "%" },
            new AutoQueryConvention { Name = "!=", Value = "%!" },
            new AutoQueryConvention { Name = ">=", Value = ">%" },
            new AutoQueryConvention { Name = ">", Value = "%>" },
            new AutoQueryConvention { Name = "<=", Value = "%<" },
            new AutoQueryConvention { Name = "<", Value = "<%" },
            new AutoQueryConvention { Name = "In", Value = "%In" },
            new AutoQueryConvention { Name = "Between", Value = "%Between" },
            new AutoQueryConvention { Name = "Starts With", Value = "%StartsWith", Types = "string" },
            new AutoQueryConvention { Name = "Contains", Value = "%Contains", Types = "string" },
            new AutoQueryConvention { Name = "Ends With", Value = "%EndsWith", Types = "string" },
        }
    },
    
    MetadataFilter = metadata => {
        //Modify metadata response
    }
});
```

### Notes

 - The `Types="string"` will limit the convention to only appear for **string** fields
 - The `MetadataFilter` lets you programmatically modify the returned metadata response

## Feedback

We'd love to hear your feedback! Please send us any suggestions or improvements on
[our UserVoice](http://servicestack.uservoice.com/forums/176786-feature-requests) or any issues to the
[Issues List](https://github.com/ServiceStack/Issues).

## [AutoQuery Viewer for iPad](https://github.com/ServiceStackApps/AutoQueryViewer)

AutoQuery Viewer for iPad is a native iOS App that provides an automatic UI for browsing, inspecting and querying any publicly accessible 
[ServiceStack AutoQuery Service](https://github.com/ServiceStack/ServiceStack/wiki/Auto-Query) from an iPad. 

[![AutoQuery Viewer on AppStore](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/autoquery/autoqueryviewer-appstore.png)](https://itunes.apple.com/us/app/autoquery-viewer/id968625288?ls=1&mt=8)

## AdminFeature Plugin Implementation

We'd like to detail how we developed `AdminFeature` as ServiceStack makes it really easy to package and 
deploy rich plugins with complex UI and behavior encapsulated within a single plugin - 
which we hope spurs the creation of even richer community [Plugins](github.com/ServiceStack/ServiceStack/wiki/Plugins)!

Development of `AdminFeature` is maintained in a TypeScript 1.8 + JSPM + React
[ServiceStack.Admin.WebHost](https://github.com/ServiceStack/Admin/tree/master/src/ServiceStack.Admin.WebHost) 
project where it's structured to provide an optimal iterative development experience. 
To re-package the App we just call on JSPM to create our app.js bundle by pointing it to the React App's 
`main` entry point:
 
    jspm bundle -m src\main ..\ServiceStack.Admin\ss_admin\app.js

Then each of the static resources are copied into the Plugins 
[ServiceStack.Admin](https://github.com/ServiceStack/Admin/tree/master/src/ServiceStack.Admin) 
project with their **Build Action** set to **Embedded Resource** so they're embedded in the 
**ServiceStack.Admin.dll**.

To add the Embedded Resources to the 
[Virtual File System](https://github.com/ServiceStack/ServiceStack/wiki/Virtual-file-system)
the `AdminFeature` just adds it to `Config.EmbeddedResourceBaseTypes` (also making it safe to ILMerge).

The entire server implementation for the `AdminFeature` is contained below, most of which is dedicated to 
supporting when ServiceStack is mounted at both root `/` or a custom path (e.g. `/api`) - which it supports 
by rewriting the embedded `index.html` with the `HandlerFactoryPath` before returning it:

```csharp
public class AdminFeature : IPlugin, IPreInitPlugin
{
    public void Configure(IAppHost appHost)
    {
        //Register ServiceStack.Admin.dll as an Embedded Resource to VirtualFiles
        appHost.Config.EmbeddedResourceBaseTypes.Add(typeof(AdminFeature));
    }

    public void Register(IAppHost appHost)
    {
        var indexHtml = appHost.VirtualFileSources.GetFile("ss_admin/index.html").ReadAllText();
        if (appHost.Config.HandlerFactoryPath != null) //Inject HandlerFactoryPath if mounted at /custom path
            indexHtml = indexHtml.Replace("/ss_admin", "/{0}/ss_admin".Fmt(appHost.Config.HandlerFactoryPath));

        appHost.CatchAllHandlers.Add((httpMethod, pathInfo, filePath) => 
            pathInfo.StartsWith("/ss_admin") 
                ? (pathInfo == "/ss_admin/index.html" || !appHost.VirtualFileSources.FileExists(pathInfo)
                    ? new StaticContentHandler(indexHtml, MimeTypes.Html) as IHttpHandler
                    : new StaticFileHandler(appHost.VirtualFileSources.GetFile(pathInfo)))
                : null);

        appHost.GetPlugin<MetadataFeature>()
            .AddPluginLink("/ss_admin/autoquery/", "AutoQuery Viewer"); //Add link to /metadata page
    }
}
```

To power most of its UI, AutoQuery Viewer makes use of the 
[existing Metadata service in AutoQuery](https://github.com/ServiceStack/Admin#advanced-customizations).

#### Code-first POCO Simplicity

Other classes worth reviewing is the 
[GitHubTasks.cs](https://github.com/ServiceStack/Admin/blob/master/tests/Admin.Tasks/GitHubTasks.cs) and
[StackOverflowTasks.cs](https://github.com/ServiceStack/Admin/blob/master/tests/Admin.Tasks/StackOverflowTasks.cs)
containing the NUnit tests used to create the test sqlite database on-the-fly, directly from the GitHub and 
StackOverflow JSON APIs, the ease of which speaks to the simplicity of 
[ServiceStack's code-first POCO approach](http://stackoverflow.com/a/32940275/85785).

## Building this solution

This project is based on jspm as said earlier. You can install this through nodeJS:

1. open command line in `src\ServiceStack.Admin.WebHost`
2. run command `npm install jspm -g` to install jspm
3. run command `jspm init` do boot up jspm
4. run command `jspm install` to download all packages

Now open the project solution:

1. Restore all the nuget packages.
2. Set ServiceStack.Admin.WebHost as startup project
3. Run Solution

