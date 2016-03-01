# ServiceStack.Admin UI

ServiceStack.Admin is the home for ServiceStack's new Admin UI with initial support for 
AutoQuery Viewer - an instant UI for constructing and browsing your 
[AutoQuery](https://github.com/ServiceStack/ServiceStack/wiki/Auto-Query) Services: 

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/query-default-values.png)](http://github.servicestack.net/ss_admin/autoquery)

> [YouTube Demo](https://youtu.be/YejYkCvKsuQ)

### Live AutoQuery Viewer Examples

- http://github.servicestack.net/ss_admin/
- http://northwind.servicestack.net/ss_admin/
- http://stackapis.servicestack.net/ss_admin/
- http://techstacks.io/ss_admin/

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
[Northwind AutoQuery Services](http://northwind.servicestack.net/ss_admin/autoquery/QueryCustomers) below:

```csharp
[Route("/query/customers")]
public class QueryCustomers : QueryBase<Customer> {}

[Route("/query/orders")]
public class QueryOrders : QueryBase<Order> {}
```

Which renders a UI with the default query and initial fields unpopulated:

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/unannotated-autoquery-services.png)](http://northwind.servicestack.net/ss_admin/autoquery/QueryCustomers)

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
public class QueryRepos : QueryBase<GithubRepo> {}
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
public class QueryOrders : QueryBase<Order> {}
```

Since the Auth attributes are Request Filter Attributes with a server dependency to **ServiceStack.dll**, if
you want to maintain and share a dependency-free **ServiceModel.dll** you can instead define a custom 
AutoQuery in your Service implementations which will inherit any Service or Action filter attributes as normal:

```csharp
public class QueryOrders : QueryBase<Order> {}

[RequiredRole("Sales")]
public class SalesServices : Service
{
    public IAutoQuery AutoQuery { get; set; }

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

Most of the AutoQuery Viewer UI is metadata driven and can be overridden when registering the `AutoQueryFeature`
plugin. The configuration below shows the defaults:

```csharp
Plugins.Add(new AutoQueryFeature 
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

