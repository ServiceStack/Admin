SET MSBUILD="C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\MSBuild\15.0\Bin\MSBuild.exe"

REM %MSBUILD% build.proj /target:Default;NuGetPack /property:Configuration=Release;MinorVersion=1;PatchVersion=0
REM exit

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
