SET MSBUILD=C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe
REM %MSBUILD% build.proj /target:TeamCityBuild;NuGetPack /property:Configuration=Release;RELEASE=true;PatchVersion=0
REM %MSBUILD% build-sn.proj /target:TeamCityBuild;NuGetPack /property:Configuration=Signed;RELEASE=true;PatchVersion=0
REM exit

cd ..\src\ServiceStack.Admin.WebHost

COPY GitHubQuery.cs ..\..\tests\TestSelfHost
COPY GitHubQuery.cs ..\..\tests\TestWebHost
COPY StackOverflowQuery.cs ..\..\tests\TestSelfHost
COPY StackOverflowQuery.cs ..\..\tests\TestWebHost
COPY App_Data\db.sqlite ..\..\tests\TestSelfHost
COPY App_Data\db.sqlite ..\..\tests\TestWebHost\App_Data

COPY default.css ..\ServiceStack.Admin\ss_admin
COPY config.js ..\ServiceStack.Admin\ss_admin
COPY jspm_packages\system.js ..\ServiceStack.Admin\ss_admin

IF EXIST ..\ServiceStack.Admin\ss_admin\img (    
    RMDIR ..\ServiceStack.Admin\ss_admin\img /s /q
)

MD ..\ServiceStack.Admin\ss_admin\img

XCOPY /E img ..\ServiceStack.Admin\ss_admin\img

REM jspm bundle src/app.js - [./src/**/*] ./deps.lib.js

REM old-style bundling
REM jspm bundle -m src/app.js ../ServiceStack.Admin/ss_admin/app.js

REM jspm build -m src/app.js ../ServiceStack.Admin/ss_admin/app.js
