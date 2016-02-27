# ServiceStack.Admin

The AutoQuery Browser provides and instant UI for constructing and browsing your 
[AutoQuery](https://github.com/ServiceStack/ServiceStack/wiki/Auto-Query) Services. 

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/query-default-values.png)](http://github.servicestack.net/ss_admin/autoquery)

### Live Examples

- [github.servicestack.net/ss_admin/](http://github.servicestack.net/ss_admin/autoquery)
- [northwind.servicestack.net/ss_admin/](http://northwind.servicestack.net/ss_admin/autoquery)
- [stackapis.servicestack.net/ss_admin/](http://stackapis.servicestack.net/ss_admin/autoquery)
- [techstacks.io/ss_admin/](http://techstacks.io/ss_admin/autoquery)

The Admin UI is a Single Page App built with React and encapsulated in a single `ServiceStack.Admin.dll` 
that's available from NuGet:

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
