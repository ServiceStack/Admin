PUSHD ..\src\ServiceStack.Admin.Web

COPY GitHubQuery.cs ..\..\tests\TestSelfHost
COPY GitHubQuery.cs ..\..\tests\TestWebHost
COPY StackOverflowQuery.cs ..\..\tests\TestSelfHost
COPY StackOverflowQuery.cs ..\..\tests\TestWebHost
COPY App_Data\db.sqlite ..\..\tests\TestSelfHost
COPY App_Data\db.sqlite ..\..\tests\TestWebHost\App_Data

RMDIR ..\ServiceStack.Admin\ss_admin /s /q
XCOPY /E wwwroot ..\ServiceStack.Admin\ss_admin\

POPD

msbuild /p:Configuration=Release ..\src\ServiceStack.Admin.sln
